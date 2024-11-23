package com.walkwithme.backend.repository;

import com.walkwithme.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.user.id = :userId")
    List<Order> findAllOrdersByUserId(@Param("userId") Long userId);

    @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.seller.id = :sellerId")
    List<Order> findAllOrdersBySellerId(@Param("sellerId") Long sellerId);
}
