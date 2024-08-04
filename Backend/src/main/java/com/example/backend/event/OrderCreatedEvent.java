package com.example.backend.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
@Getter
public class OrderCreatedEvent extends ApplicationEvent {
    private Long orderId;

    public OrderCreatedEvent(Object source, Long orderId){
        super(source);
        this.orderId=orderId;
    }

}
