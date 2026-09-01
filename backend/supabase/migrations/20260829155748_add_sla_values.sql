INSERT INTO sla_policies (
        name,
        priority,
        first_response_minutes,
        resolution_minutes
    )
VALUES ('Low Priority', 'low', 1440, 4320),
    ('Medium Priority', 'medium', 480, 1440),
    ('High Priority', 'high', 120, 480),
    ('Urgent Priority', 'urgent', 30, 240);