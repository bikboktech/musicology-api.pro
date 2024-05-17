exports.seed = async knex => {
    await knex('accounts').insert([
        {
            account_type_id: 2, 
            full_name: 'DJ Luca Montecchi (Disco Daddy)', 
            email: 'luca-montecchi@musicology.pro', 
            password: '$2a$12$R7FAJFvQsHSV1yksyES/jOSMA5Lxyd1zRqJY5Dvd8GO1vVRStUNii', 
            active: 1
        },
        {
            account_type_id: 2, 
            full_name: 'DJ Li\'l Cox', 
            email: 'lil-cox@musicology.pro', 
            password: '$2a$12$R7FAJFvQsHSV1yksyES/jOSMA5Lxyd1zRqJY5Dvd8GO1vVRStUNii', 
            active: 1
        },
        {
            account_type_id: 2, 
            full_name: 'DJ Balkan Boy', 
            email: 'balkan-boy@musicology.pro', 
            password: '$2a$12$R7FAJFvQsHSV1yksyES/jOSMA5Lxyd1zRqJY5Dvd8GO1vVRStUNii', 
            active: 1
        },
        {
            account_type_id: 2, 
            full_name: 'DJ Manuel Lupen', 
            email: 'manuel-lupen@musicology.pro', 
            password: '$2a$12$R7FAJFvQsHSV1yksyES/jOSMA5Lxyd1zRqJY5Dvd8GO1vVRStUNii', 
            active: 1
        },
        {
            account_type_id: 2, 
            full_name: 'DJ Peruc Beats', 
            email: 'peruc-beats@musicology.pro', 
            password: '$2a$12$R7FAJFvQsHSV1yksyES/jOSMA5Lxyd1zRqJY5Dvd8GO1vVRStUNii', 
            active: 1
        },
    ]);
};