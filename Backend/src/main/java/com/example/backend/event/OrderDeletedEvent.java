package com.example.backend.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
@Getter
public class OrderDeletedEvent extends ApplicationEvent {
    private Long orderId;

    public OrderDeletedEvent(Object source, Long orderId){
        super(source);
        this.orderId=orderId;
    }

}
