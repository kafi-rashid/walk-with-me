package com.walkwithme.backend.dto;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class RoleDto {
    private  Long id;
    private String name;
    public RoleDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
