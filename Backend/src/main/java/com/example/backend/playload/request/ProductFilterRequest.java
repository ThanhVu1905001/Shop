package com.example.backend.playload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductFilterRequest {
    private String keyword;
    private int page;
    private int pageSize;
}
