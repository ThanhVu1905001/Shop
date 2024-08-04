package com.example.backend.playload.request;

import java.awt.print.Pageable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerFilterRequest {
    private String filter;

    private int page;

    private int pageSize;
}
