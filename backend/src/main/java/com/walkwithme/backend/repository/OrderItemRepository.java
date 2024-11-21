package com.walkwithme.backend.repository;


import com.walkwithme.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT CASE WHEN COUNT(oi) > 0 THEN TRUE ELSE FALSE END FROM OrderItem oi WHERE oi.product.id = :productId")
    boolean existsByProductId(@Param("productId") Long productId);
}
