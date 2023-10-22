package app.database.seeders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class Seeder implements CommandLineRunner {

    @Autowired
    private CitySeeder citySeeder;

    @Autowired
    private RoleSeeder roleSeeder;

    @Autowired
    private UserSeeder userSeeder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Database seeding started...");

        citySeeder.seed();
        System.out.println("Cities seeded.");

        roleSeeder.seed();
        System.out.println("Roles seeded.");

        userSeeder.seed();
        System.out.println("Users seeded.");

        System.out.println("Database seeding completed.");
    }
}
