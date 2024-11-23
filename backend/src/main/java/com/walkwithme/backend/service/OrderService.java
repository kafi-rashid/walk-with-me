package com.walkwithme.backend.service;

import com.walkwithme.backend.dto.OrderDTO;
import com.walkwithme.backend.model.OrderStatus;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderDTO orderDTO);
    OrderDTO getOrderById(Long id);
    List<OrderDTO> getAllOrders();
    List<OrderDTO> getAllOrdersByUser(Long userId, Long sellerId);
    OrderDTO updateOrder(Long id, OrderDTO orderDTO);
    void deleteOrder(Long id);
    String changeOrderStatus(Long id, OrderStatus status);
    String cancelOrder(Long orderId, Long userId);
/*
    void updateOrderStatus(Long orderId, Long sellerId, OrderStatus newStatus);
*/
}