DO $$ 
DECLARE
    cafe_latte_id UUID;
    bean_scene_id UUID;
    coffee_tales_id UUID;
BEGIN
    -- Insert cafes and get their IDs
    INSERT INTO cafes (name, description, location) 
    VALUES ('Cafe Latte', 'A cozy cafe in the heart of downtown', 'Downtown')
    RETURNING id INTO cafe_latte_id;

    INSERT INTO cafes (name, description, location) 
    VALUES ('Bean Scene', 'Modern cafe with great ambiance', 'Orchard')
    RETURNING id INTO bean_scene_id;

    INSERT INTO cafes (name, description, location) 
    VALUES ('Coffee Tales', 'Artisanal coffee and pastries', 'Marina Bay')
    RETURNING id INTO coffee_tales_id;

    -- Insert employees
    INSERT INTO employees (id, name, email_address, phone_number, gender, cafe_id, start_date) 
    VALUES 
    ('UI' || substring(md5(random()::text), 1, 7), 'John Doe', 'john@example.com', '91234567', 'Male', cafe_latte_id, '2024-01-01'),
    ('UI' || substring(md5(random()::text), 1, 7), 'Jane Smith', 'jane@example.com', '82345678', 'Female', bean_scene_id, '2024-01-15'),
    ('UI' || substring(md5(random()::text), 1, 7), 'Mike Johnson', 'mike@example.com', '93456789', 'Male', coffee_tales_id, '2024-02-01');

EXCEPTION WHEN others THEN
    RAISE NOTICE 'Error while inserting data: %', SQLERRM;
END $$;