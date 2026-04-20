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
                lab.setAvailabilityWindows("Mon-Fri 08:30 - 17:30");
                lab.setStatus(Resource.ResourceStatus.ACTIVE);

                Resource seminar = new Resource();
                seminar.setName("Seminar Room B");
                seminar.setType("SEMINAR_ROOM");
                seminar.setCapacity(40);
                seminar.setLocation("block A, 1st floor");
                seminar.setAvailabilityWindows("Mon-Sat 08:00 - 18:00");
                seminar.setStatus(Resource.ResourceStatus.ACTIVE);

                Resource auditorium = new Resource();
                auditorium.setName("Main Auditorium");
                auditorium.setType("AUDITORIUM");
                auditorium.setCapacity(300);
                auditorium.setLocation("block C, Ground floor");
                auditorium.setAvailabilityWindows("Daily 08:00 - 22:00");
                auditorium.setStatus(Resource.ResourceStatus.ACTIVE);

                resourceRepository.saveAll(List.of(lab, seminar, auditorium));
                System.out.println("Sample resources seeded successfully!");
            } else {
                // Update existing resources if they have N/A or null availability
                resourceRepository.findAll().forEach(res -> {
                    if (res.getAvailabilityWindows() == null || res.getAvailabilityWindows().equals("N/A")) {
                        if (res.getName().contains("Lab")) res.setAvailabilityWindows("Mon-Fri 08:30 - 17:30");
                        else if (res.getName().contains("Seminar")) res.setAvailabilityWindows("Mon-Sat 08:00 - 18:00");
                        else if (res.getName().contains("Auditorium")) res.setAvailabilityWindows("Daily 08:00 - 22:00");
                        else res.setAvailabilityWindows("Mon-Fri 09:00 - 17:00");
                        resourceRepository.save(res);
                    }
                });
                System.out.println("Existing resources updated with availability windows!");
            }
        };
    }
}
