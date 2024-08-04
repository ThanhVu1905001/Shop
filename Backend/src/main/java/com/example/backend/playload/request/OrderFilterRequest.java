package com.example.backend.playload.request;

import java.time.Instant;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

@Getter
@Setter
public class OrderFilterRequest {
    private String filter;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Instant createdDate;

    private Boolean sortAmountAscending;
}
