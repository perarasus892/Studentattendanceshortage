import { NextResponse } from 'next/server';

export async function GET() {
    // Mock ads for now, in a real app these would come from the DB
    const ads = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
            title: 'Summer Internship 2026',
            description: 'Apply now for exclusive internship opportunities at top tech firms. Deadline approaching!',
            link: '#'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1517245385169-d39139a4a5a7?w=800&q=80',
            title: 'Tech Symposium 2026',
            description: 'Join us for a day of innovation, workshops, and learning from industry leaders.',
            link: '#'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?w=800&q=80',
            title: 'New Library Resources',
            description: 'Access the latest digital journals, research papers, and technical books now.',
            link: '#'
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: 'Annual Sports Meet',
            description: 'Register for athletic events and showcase your talent on the field. All departments welcome!',
            link: '#'
        },
        {
            id: 5,
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: 'Academic Excellence Awards',
            description: 'Nominations are now open for the annual student achievement and research awards.',
            link: '#'
        }
    ];

    return NextResponse.json(ads);
}
