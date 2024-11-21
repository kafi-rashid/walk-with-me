package com.walkwithme.backend.service;

import com.walkwithme.backend.dto.OrderDTO;
import com.walkwithme.backend.model.OrderStatus;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderDTO orderDTO);
    OrderDTO getOrderById(Long id);
    List<OrderDTO> getAllOrders();
    OrderDTO updateOrder(Long id, OrderDTO orderDTO);
    void deleteOrder(Long id);
    void changeOrderStatus(Long id, OrderStatus status);
    void cancelOrder(Long orderId, Long sellerId);
/*
    void updateOrderStatus(Long orderId, Long sellerId, OrderStatus newStatus);
*/
}