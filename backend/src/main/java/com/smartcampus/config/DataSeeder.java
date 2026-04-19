package com.smartcampus.config;

import com.smartcampus.entity.Resource;
import com.smartcampus.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedResources(ResourceRepository resourceRepository) {
        return args -> {
            if (resourceRepository.count() == 0) {
                Resource lab = new Resource();
                lab.setName("Computer Lab 301");
                lab.setType("LAB");
                lab.setCapacity(60);
                lab.setLocation("block F, 3rd floor");
                lab.setStatus(Resource.ResourceStatus.ACTIVE);

                Resource seminar = new Resource();
                seminar.setName("Seminar Room B");
                seminar.setType("SEMINAR_ROOM");
                seminar.setCapacity(40);
                seminar.setLocation("block A, 1st floor");
                seminar.setStatus(Resource.ResourceStatus.ACTIVE);

                Resource auditorium = new Resource();
                auditorium.setName("Main Auditorium");
                auditorium.setType("AUDITORIUM");
                auditorium.setCapacity(300);
                auditorium.setLocation("block C, Ground floor");
                auditorium.setStatus(Resource.ResourceStatus.ACTIVE);

                resourceRepository.saveAll(List.of(lab, seminar, auditorium));
                System.out.println("Sample resources seeded successfully!");
            }
        };
    }
}
