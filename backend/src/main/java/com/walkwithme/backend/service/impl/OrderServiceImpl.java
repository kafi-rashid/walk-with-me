package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.dto.OrderDTO;
import com.walkwithme.backend.dto.OrderItemDTO;
import com.walkwithme.backend.model.*;
import com.walkwithme.backend.repository.OrderRepository;
import com.walkwithme.backend.repository.OrderItemRepository;
import com.walkwithme.backend.repository.ProductRepository;
import com.walkwithme.backend.repository.UserRepository;
import com.walkwithme.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setUser(userRepository.findById(orderDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found")));
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setBillingAddress(orderDTO.getBillingAddress());
        Order savedOrder = orderRepository.save(order);
        for (OrderItemDTO itemDTO : orderDTO.getItems()) {
            OrderItem item = new OrderItem();
            item.setOrder(savedOrder);
            item.setProduct(productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found")));
//            item.setVariant(itemDTO.getVariantId() != null ? productRepository.findVariantById(itemDTO.getVariantId()) : null);
            item.setQuantity(itemDTO.getQuantity());
            item.setPrice(itemDTO.getPrice());

            orderItemRepository.save(item);
        }

        return mapToDTO(savedOrder);
    }

    @Override
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        return mapToDTO(order);
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        order.setStatus(orderDTO.getStatus());
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setBillingAddress(orderDTO.getBillingAddress());

        orderRepository.save(order);
        return mapToDTO(order);
    }

    @Override
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        orderRepository.delete(order);
    }

    @Override
    public void changeOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(status);
        orderRepository.save(order);
    }

    private OrderDTO mapToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(item -> OrderItemDTO.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .variantId(item.getVariant() != null ? item.getVariant().getId() : null)
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .items(itemDTOs)
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .billingAddress(order.getBillingAddress())
                .build();
    }
}
