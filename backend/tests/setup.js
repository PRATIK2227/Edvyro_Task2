process.env.NODE_ENV='test';
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/careerconnect_test';
process.env.JWT_SECRET ??= 'test_secret_for_careerconnect_only_123456789';
