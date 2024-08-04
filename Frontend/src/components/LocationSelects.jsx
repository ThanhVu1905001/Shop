import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input } from 'antd';

const LocationSelects = ({form, loading }) => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json");
        setCities(response.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    const selectedCityData = cities.find(city => city.Id === selectedCityId);
    setSelectedCity(selectedCityData.Id);
    setDistricts(selectedCityData ? selectedCityData.Districts : []);
    setSelectedDistrict(''); // Reset selected district when a city is chosen
    setWards([]);
    setSelectedWard(''); // Reset selected ward when a city is chosen
  };
  
  const handleDistrictChange = (e) => {
    const selectedDistrictId = e.target.value;
    const selectedDistrictData = districts.find(district => district.Id === selectedDistrictId);
    setSelectedDistrict(selectedDistrictData.Id);
    setWards(selectedDistrictData ? selectedDistrictData.Wards : []);
    setSelectedWard(''); // Reset selected ward when a district is chosen
  };
  
  const handleWardChange = (e) => {
    const selectedWardId = e.target.value;
    const selectedWardData = wards.find(ward => ward.Id === selectedWardId);
    setSelectedWard(selectedWardData.Id);
  };

  useEffect(() => {
  const cityName = cities.find(city => city.Id === selectedCity)?.Name || '';
  const districtName = districts.find(district => district.Id === selectedDistrict)?.Name || '';
  const wardName = wards.find(ward => ward.Id === selectedWard)?.Name || '';

  const address = `${cityName ? cityName + ', ' : ''}${districtName ? districtName + ', ' : ''}${wardName ? wardName : ''}`;

  setTimeout(() => {
    form.setFieldsValue({ address: address });
  }, 0);
}, [selectedCity, selectedDistrict, selectedWard, cities, districts, wards]);
  
  return (
    <div style={{ marginBottom: '16px' }}>
     <Form form={form}>
      <select style={{ marginRight: '8px', marginBottom: '8px', padding: '4px',width: '32%' }} value={selectedCity} onChange={handleCityChange}>
        <option value="" disabled>Chọn thành phố</option>
        {cities.map(city => (
          <option key={city.Id} value={city.Id}>{city.Name}</option>
        ))}
      </select>

      <select style={{ marginRight: '8px', marginBottom: '8px', padding: '4px', width: '32%'  }} value={selectedDistrict} onChange={handleDistrictChange}>
        <option value="" disabled>Chọn quận huyện</option>
        {districts.map(district => (
          <option key={district.Id} value={district.Id}>{district.Name}</option>
        ))}
      </select>

      <select style={{ marginBottom: '8px', padding: '4px', width: '32%'  }} value={selectedWard} onChange={handleWardChange}>
        <option value="" disabled>Chọn phường xã</option>
        {wards.map(ward => (
          <option key={ward.Id} value={ward.Id}>{ward.Name}</option>
        ))}
      </select>

      {loading && <div>Loading...</div>}

      {/* Hidden input field to store the address */}
      <Form.Item name="address" hidden>
        <Input />
      </Form.Item>
    </Form>
    </div>
  );
};

export default LocationSelects;
