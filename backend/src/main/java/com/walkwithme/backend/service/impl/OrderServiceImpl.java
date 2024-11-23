package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.dto.AddressDtoBuilder;
import com.walkwithme.backend.dto.OrderDTO;
import com.walkwithme.backend.dto.OrderItemDTO;
import com.walkwithme.backend.model.*;
import com.walkwithme.backend.repository.*;
import com.walkwithme.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductVarientRepository productVarientRepository;

    @Autowired
    private AddressRepository addressRepository;
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

//        if (user.getRoles().stream().anyMatch(role -> role.getName().equalsIgnoreCase("seller"))) {
//            throw new IllegalArgumentException("You cannot order a product as a seller");
//        }

        UserEntity seller = null;
        Address billingAddress = null;
        Address shippingAddress = null;

        if (orderDTO.getSellerId() != null) {
            seller = userRepository.findById(orderDTO.getSellerId())
                    .orElseThrow(() -> new IllegalArgumentException("Seller not found with ID: " + orderDTO.getSellerId()));
        }

        if (orderDTO.getBillingAddressId() != null) {
            billingAddress = addressRepository.findById(orderDTO.getBillingAddressId())
                    .orElseThrow(() -> new IllegalArgumentException("Billing address not found with ID: " + orderDTO.getBillingAddressId()));
        }

        if (orderDTO.getShippingAddressId() != null) {
            shippingAddress = addressRepository.findById(orderDTO.getShippingAddressId())
                    .orElseThrow(() -> new IllegalArgumentException("Shipping address not found with ID: " + orderDTO.getShippingAddressId()));
        }

        Order order = new Order();
        order.setUser(user);
        order.setSeller(seller);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setBillingAddress(billingAddress);
        order.setShippingAddress(shippingAddress);
        order.setOrderDate(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = orderDTO.getItems().stream().map(itemDTO -> {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + itemDTO.getProductId()));
//            product.setImage(null);

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

//    @Override
//    public List<OrderDTO> getAllOrders() {
//        List<Order> orders = orderRepository.findAll();
//        return orders.stream().map(this::mapToDTO).collect(Collectors.toList());
//    }
@Override
public List<OrderDTO> getAllOrders() {
    List<Order> orders = orderRepository.findAll();
    return orders.stream().map(this::mapToListDTO).collect(Collectors.toList());
}

    @Override
    public List<OrderDTO> getAllOrdersByUser(Long userId) {
        try {
            List<Order> orders = orderRepository.findAllOrdersByUserId(userId);
            return orders.stream()
                    .map(this::mapToListDTO)
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
                .variantId(orderItem.getVariant() != null ? orderItem.getVariant().getId() : null)
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .build();
    }
    private OrderDTO mapToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(this::mapOrderItemToDTO)
                .collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .sellerId(order.getSeller() != null ? order.getSeller().getId() : null)
                .items(itemDTOs)
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddressId(order.getShippingAddress() != null ? order.getShippingAddress().getId() : null)
                .billingAddressId(order.getBillingAddress() != null ? order.getBillingAddress().getId() : null)
                .buyerName(order.getUser().getFirstName() + " " + order.getUser().getLastName())
                .sellerName(order.getSeller() != null ? order.getSeller().getFirstName() + " " + order.getSeller().getLastName() : null)
                .shippingAddress(mapAddressToDTO(order.getShippingAddress()))
                .billingAddress(mapAddressToDTO(order.getBillingAddress()))
                .orderDate(order.getOrderDate())
                .build();
    }
    private OrderDTO mapToListDTO(Order order) {
//        List<OrderItemDTO> itemDTOs = order.getItems().stream()
//                .map(this::mapOrderItemToDTO)
//                .collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .sellerId(order.getSeller() != null ? order.getSeller().getId() : null)
//                .items(itemDTOs)
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddressId(order.getShippingAddress() != null ? order.getShippingAddress().getId() : null)
                .billingAddressId(order.getBillingAddress() != null ? order.getBillingAddress().getId() : null)
                .buyerName(order.getUser().getFirstName() + " " + order.getUser().getLastName())
                .sellerName(order.getSeller() != null ? order.getSeller().getFirstName() + " " + order.getSeller().getLastName() : null)
                .shippingAddress(mapAddressToDTO(order.getShippingAddress()))
                .billingAddress(mapAddressToDTO(order.getBillingAddress()))
                .orderDate(order.getOrderDate())
                .build();
    }

    private AddressDtoBuilder mapAddressToDTO(Address address) {
        if (address == null) return null;
        return AddressDtoBuilder.builder()
                .id(address.getId())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .postalCode(address.getPostalCode())
                .country(address.getCountry())
                .build();
    }

}
