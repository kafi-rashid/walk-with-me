package com.walkwithme.backend.controller;

import com.walkwithme.backend.dto.OrderDTO;
import com.walkwithme.backend.model.OrderStatus;
import com.walkwithme.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO) {
        OrderDTO createdOrder = orderService.createOrder(orderDTO);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long id) {
        OrderDTO order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
//    @GetMapping("/by-user")
//    public ResponseEntity<List<OrderDTO>> getAllOrdersByUser(@RequestParam Long userId) {
//        List<OrderDTO> orders = orderService.getAllOrdersByUser(userId);
//        return ResponseEntity.ok(orders);
//    }
    @GetMapping("/by-user")
    public ResponseEntity<List<OrderDTO>> getAllOrdersByUser(@RequestParam(required = false) Long userId, @RequestParam(required = false) Long sellerId) {
        List<OrderDTO> orders = orderService.getAllOrdersByUser(userId, sellerId);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Long id, @RequestBody OrderDTO orderDTO) {
        OrderDTO updatedOrder = orderService.updateOrder(id, orderDTO);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> changeOrderStatus(@PathVariable Long id, @RequestParam String status) {
        orderService.changeOrderStatus(id, OrderStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable Long orderId, @RequestParam Long userId) {
        orderService.cancelOrder(orderId, userId);
        return ResponseEntity.ok("Order canceled successfully");
    }

}
