package com.example.backend.helper;

import com.example.backend.model.Customer;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import javax.swing.InputMap;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

public class ExcelHelper {
    public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    static String[] HEADERs = {"Id", "Code", "Name", "Address", "Phone", "Email", "Description", "TotalSpending", "TotalOrders", "MostRecentOrder"};

    static String SHEET = "Customers";

    public static boolean hasExcelFormat(MultipartFile file){
        if(TYPE.equals(file.getContentType())){
            System.out.println(TYPE.equals(file.getContentType()));
            return false;
        }
        return true;
    }

    public static List<Customer> excelToCustomers(InputStream in) throws IOException {
        try {
            Workbook workbook = new XSSFWorkbook(in);
            Sheet sheet = workbook.getSheet(SHEET);

            if (sheet == null) {
                throw new RuntimeException("Sheet '" + SHEET + "' not found in the Excel file.");
            }

            Iterator<Row> rows = sheet.iterator();

            List<Customer> customers = new ArrayList<>();

            int rowNumber = 0;

            while (rows.hasNext()) {
                Row currentRow = rows.next();

                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                Iterator<Cell> cellsInRow = currentRow.iterator();

                Customer customer = new Customer();

                int cellIdx = 0;
                while (cellsInRow.hasNext()) {
                    Cell currentCell = cellsInRow.next();

                    switch (cellIdx) {
                        case 0 -> customer.setId((long) currentCell.getNumericCellValue());
                        case 1 -> {
                            if (currentCell.getCellType() == CellType.STRING) {
                                customer.setCode(currentCell.getStringCellValue());
                            } else if (currentCell.getCellType() == CellType.NUMERIC) {
                                customer.setCode(
                                    String.valueOf((int) currentCell.getNumericCellValue()));
                            }
                        }
                        case 2 -> {
                            if (currentCell.getCellType() == CellType.STRING) {
                                customer.setName(currentCell.getStringCellValue());
                            } else if (currentCell.getCellType() == CellType.NUMERIC) {
                                customer.setName(
                                    String.valueOf((int) currentCell.getNumericCellValue()));
                            }
                        }
                        case 3 -> {
                            if (currentCell.getCellType() == CellType.STRING) {
                                customer.setAddress(currentCell.getStringCellValue());
                            } else if (currentCell.getCellType() == CellType.NUMERIC) {
                                customer.setAddress(
                                    String.valueOf((int) currentCell.getNumericCellValue()));
                            }
                        }
                        case 4 -> {
                            if (currentCell.getCellType() == CellType.STRING) {
                                customer.setPhone(currentCell.getStringCellValue());
                            } else if (currentCell.getCellType() == CellType.NUMERIC) {
                                customer.setPhone(
                                    String.valueOf((int) currentCell.getNumericCellValue()));
                            }
                        }
                        case 5 -> {
                            if (currentCell.getCellType() == CellType.STRING) {
                                customer.setEmail(currentCell.getStringCellValue());
                            } else if (currentCell.getCellType() == CellType.NUMERIC) {
                                customer.setEmail(
                                    String.valueOf((int) currentCell.getNumericCellValue()));
                            }
                        }
                        case 6 -> {
                            if (currentCell.getCellType() == CellType.STRING) {
                                customer.setDescription(currentCell.getStringCellValue());
                            } else if (currentCell.getCellType() == CellType.NUMERIC) {
                                customer.setDescription(
                                    String.valueOf((int) currentCell.getNumericCellValue()));
                            }
                        }
                        case 7 -> customer.setTotalSpending((int) currentCell.getNumericCellValue());
                        case 8 -> customer.setTotalOrders((int) currentCell.getNumericCellValue());
                        case 9 -> customer.setMostRecentOrder(currentCell.getDateCellValue().toInstant());
                        default -> {
                        }
                    }
                    cellIdx++;
                }
                customers.add(customer);
            }
            workbook.close();
            return customers;
        } catch (IOException e) {
            throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
        }
    }

    public static ByteArrayInputStream customersToExcel(List<Customer> customers){
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream();){
            Sheet sheet = workbook.createSheet(SHEET);

            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < HEADERs.length; col++){
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(HEADERs[col]);
            }

            int rowIdx = 1;
            for (Customer customer : customers){
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(customer.getId());
                row.createCell(1).setCellValue(customer.getCode());
                row.createCell(2).setCellValue(customer.getName());
                row.createCell(3).setCellValue(customer.getAddress());
                row.createCell(4).setCellValue(customer.getPhone());
                row.createCell(5).setCellValue(customer.getEmail());
                row.createCell(6).setCellValue(customer.getDescription());
                row.createCell(7).setCellValue(customer.getTotalSpending());
                row.createCell(8).setCellValue(customer.getTotalOrders());
                row.createCell(9).setCellValue(String.valueOf(customer.getMostRecentOrder()));
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }catch(IOException e){
            throw new RuntimeException("fail to import data to Excel file: " + e.getMessage());
        }
    }

}
