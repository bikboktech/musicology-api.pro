exports.seed = async knex => {
    // Deletes and reloads ALL existing account_types entries
    await knex('account_types').del();
    await knex('account_types').insert([
        {id: 1, name: 'Admin'},
        {id: 2, name: 'DJ'},
        {id: 3, name: 'Client'}
    ]);

    // Deletes and reloads ALL existing event_types entries
    await knex('event_types').del();
    await knex('event_types').insert([
        {id: 1, name: 'Wedding'},
        {id: 2, name: 'Birthday'},
        {id: 3, name: 'Corporate Event'},
        {id: 4, name: 'Other'}
    ]);

    // Deletes and reloads ALL existing accounts entries
    await knex('accounts').del();
    await knex('accounts').insert([
        {
            account_type_id: 1, 
            full_name: 'Administrator', 
            email: 'admin@musicology.com', 
            password: '$2a$12$R7FAJFvQsHSV1yksyES/jOSMA5Lxyd1zRqJY5Dvd8GO1vVRStUNii', 
            active: 1
        },
        {
            account_type_id: 2, 
            full_name: 'Martin Garrix', 
            email: 'dj@musicology.com', 
            password: '$2a$12$R7FAJFvQsHSV1yksyES/jOSMA5Lxyd1zRqJY5Dvd8GO1vVRStUNii', 
            active: 1
        },
        {
            account_type_id: 3, 
            full_name: 'Pero Perić', 
            email: 'pperic@email.com', 
            password: '$2a$12$R7FAJFvQsHSV1yksyES/jOSMA5Lxyd1zRqJY5Dvd8GO1vVRStUNii', 
            active: 1
        }
    ]);
};