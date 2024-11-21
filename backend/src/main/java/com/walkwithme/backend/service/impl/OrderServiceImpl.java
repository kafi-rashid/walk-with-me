package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.dto.OrderDTO;
import com.walkwithme.backend.dto.OrderItemDTO;
import com.walkwithme.backend.model.*;
import com.walkwithme.backend.repository.*;
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
    private ProductVarientRepository productVarientRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        UserEntity user = userRepository.findById(orderDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + orderDTO.getUserId()));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(orderDTO.getTotalAmount());
//        order.setShippingAddress(orderDTO.getShippingAddress());
//        order.setBillingAddress(orderDTO.getBillingAddress());

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = orderDTO.getItems().stream().map(itemDTO -> {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + itemDTO.getProductId()));

            OrderItem item = new OrderItem();
            item.setOrder(savedOrder);
            item.setProduct(product);
            item.setVariant(itemDTO.getVariantId() != null
                    ? productVarientRepository.findById(itemDTO.getVariantId())
                    .orElseThrow(() -> new IllegalArgumentException("Variant not found with ID: " + itemDTO.getVariantId()))
                    : null);
            item.setQuantity(itemDTO.getQuantity());
            item.setPrice(itemDTO.getPrice());
            return item;
        }).collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);

        savedOrder.setItems(orderItems);

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
    public List<OrderDTO> getAllOrdersByUser(Long userId) {
        try {
            List<Order> orders = orderRepository.findAllOrdersByUserId(userId);
            return orders.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching orders for user with ID: " + userId, e);
        }
    }


    @Override
    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        order.setStatus(orderDTO.getStatus());
        order.setTotalAmount(orderDTO.getTotalAmount());
//        order.setShippingAddress(orderDTO.getShippingAddress());
//        order.setBillingAddress(orderDTO.getBillingAddress());

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
    public String changeOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + id));

        if (order.getStatus() == status) {
            return "The order is already in the status: " + status + ".";
        }

        order.setStatus(status);
        orderRepository.save(order);

        return "Order status updated to " + status + " successfully.";
    }

    @Override
    public String cancelOrder(Long orderId, Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        boolean isSeller = user.getRoles().stream()
                .anyMatch(role -> "seller".equalsIgnoreCase(role.getName()));

        if (isSeller) {
            if (order.getStatus() == OrderStatus.CANCELLED) {
                return "This order has already been cancelled.";
            }

            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
            return "Order with ID: " + orderId + " has been successfully cancelled by the seller.";
        }

        if (!order.getUser().getId().equals(userId)) {
            return "You do not have permission to cancel this order.";
        }

        if (order.getStatus() == OrderStatus.SHIPPED ||
                order.getStatus() == OrderStatus.ON_THE_WAY ||
                order.getStatus() == OrderStatus.DELIVERED) {
            return "You cannot cancel this order as it has already been shipped.";
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            return "This order has already been cancelled.";
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        return "Order with ID: " + orderId + " has been successfully cancelled by the buyer.";
    }

    private OrderItemDTO mapOrderItemToDTO(OrderItem orderItem) {
        return OrderItemDTO.builder()
                .id(orderItem.getId())
                .productId(orderItem.getProduct().getId())
                .productName(orderItem.getProduct().getName())
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .build();
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
//                .shippingAddress(order.getShippingAddress())
//                .billingAddress(order.getBillingAddress())
                .build();
    }
}
