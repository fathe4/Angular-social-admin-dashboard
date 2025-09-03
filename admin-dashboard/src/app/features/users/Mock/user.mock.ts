import { Profile, User, UsersListResponse, UserRole } from '../models/user.model';

export const demoUsers: User[] = [
  {
    id: 'u1',
    email: 'john.doe@example.com',
    username: 'john_doe',
    first_name: 'John',
    last_name: 'Doe',
    profile_picture: 'https://randomuser.me/api/portraits/men/1.jpg',
    cover_picture: 'https://picsum.photos/seed/john/800/200',
    bio: 'Tech enthusiast, coffee lover, and weekend traveler.',
    location: 'New York, USA',
    contact_info: {
      phone: '+1-555-0123',
      website: 'https://johndoe.dev',
    },
    role: UserRole.ADMIN,
    is_verified: true,
    is_active: true,
    settings: {
      notifications: true,
      privacy: 'public',
    },
    created_at: '2023-01-10T10:00:00Z',
    updated_at: '2023-06-05T14:30:00Z',
  },
  {
    id: 'u2',
    email: 'jane.smith@example.com',
    username: 'jane_smith',
    first_name: 'Jane',
    last_name: 'Smith',
    profile_picture: 'https://randomuser.me/api/portraits/women/2.jpg',
    cover_picture: 'https://picsum.photos/seed/jane/800/200',
    bio: 'Bookworm and aspiring writer.',
    location: 'London, UK',
    contact_info: {
      phone: '+44-20-7946-0958',
      website: 'https://janesmithwrites.com',
    },
    role: UserRole.USER,
    is_verified: false,
    is_active: true,
    settings: {
      notifications: false,
      privacy: 'friends',
    },
    created_at: '2023-02-14T12:15:00Z',
    updated_at: '2023-07-01T08:20:00Z',
  },
  {
    id: 'u3',
    email: 'mike.lee@example.com',
    username: 'mike_lee',
    first_name: 'Mike',
    last_name: 'Lee',
    profile_picture: 'https://randomuser.me/api/portraits/men/3.jpg',
    cover_picture: 'https://picsum.photos/seed/mike/800/200',
    bio: 'Fitness coach and food blogger.',
    location: 'Sydney, Australia',
    contact_info: {
      phone: '+61-2-9374-4000',
      website: 'https://mikeleefitness.com',
    },
    role: UserRole.MODERATOR,
    is_verified: true,
    is_active: false,
    settings: {
      notifications: true,
      privacy: 'public',
    },
    created_at: '2023-03-18T09:45:00Z',
    updated_at: '2023-08-12T16:50:00Z',
  },
];

export const demoProfiles: Profile[] = [
  {
    id: 'p1',
    user_id: 'u1',
    location: 'New York, USA',
    coordinates: [40.7128, -74.006], // Fixed: array format for PostGIS
    interests: {
      categories: ['technology', 'travel', 'coffee'],
      tags: ['programming', 'photography', 'adventure'],
    },
    birth_date: '1990-06-15',
    occupation: 'Software Engineer',
    education: 'BSc Computer Science',
    relationship_status: 'single', // Fixed: enum value
    created_at: '2023-01-10T10:00:00Z',
    updated_at: '2023-06-05T14:30:00Z',
    age: 33,
  },
  {
    id: 'p2',
    user_id: 'u2',
    location: 'London, UK',
    coordinates: [51.5074, -0.1278], // Fixed: array format for PostGIS
    interests: {
      categories: ['reading', 'writing', 'art'],
      tags: ['literature', 'poetry', 'painting'],
    },
    birth_date: '1995-03-22',
    occupation: 'Freelance Writer',
    education: 'MA English Literature',
    relationship_status: 'in_relationship', // Fixed: enum value
    created_at: '2023-02-14T12:15:00Z',
    updated_at: '2023-07-01T08:20:00Z',
    age: 28,
  },
  {
    id: 'p3',
    user_id: 'u3',
    location: 'Sydney, Australia',
    coordinates: [-33.8688, 151.2093], // Fixed: array format for PostGIS
    interests: {
      categories: ['fitness', 'food', 'photography'],
      tags: ['workout', 'cooking', 'nature'],
    },
    birth_date: '1988-11-05',
    occupation: 'Fitness Coach',
    education: 'Diploma in Sports Science',
    relationship_status: 'married', // Fixed: enum value
    created_at: '2023-03-18T09:45:00Z',
    updated_at: '2023-08-12T16:50:00Z',
    age: 35,
  },
];

// Helper function to create paginated response
export function createUsersListResponse(
  users: User[],
  page: number = 1,
  limit: number = 10
): UsersListResponse {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return {
    users: paginatedUsers,
    total: users.length,
    page,
    limit,
  };
}
