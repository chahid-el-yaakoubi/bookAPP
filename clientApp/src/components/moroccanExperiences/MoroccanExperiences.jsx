import React, { useRef } from 'react'
import './MoroccanExperiences.css'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
export const MoroccanExperiences = () => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const itemWidth = current.querySelector('.experienceItem').offsetWidth;
            const scrollAmount = itemWidth + 16; // Width of item + gap

            if (direction === 'left') {
                current.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                current.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    };

    const nadorExperiences = [
        {
            id: "6743339ac1ae185b5869a5ed",
            title: "Marchica Lagoon",
            image: "https://images.unsplash.com/photo-1596395819057-e37f55a8516b?q=80&w=1000&auto=format&fit=crop",
            description: "Visit one of the largest lagoons in the Mediterranean",
            price: "From $40"
        },
        {
            id: "6743339ac1ae185b5869a5ed",
            title: "Charrana Beach",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
            description: "Enjoy the pristine waters of this beautiful beach",
            price: "From $25"
        },
        {
            id: "6743339ac1ae185b5869a5ed",
            title: "Mount Gurugu Tours",
            image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1000&auto=format&fit=crop",
            description: "Hike the iconic mountain with panoramic views of Nador",
            price: "From $35"
        },
        {
            id: "6743339ac1ae185b5869a5ed",
            title: "Traditional Souk Visit",
            image: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?q=80&w=1000&auto=format&fit=crop",
            description: "Experience the local market and Riffian culture",
            price: "From $20"
        },
        {
            id: "6743339ac1ae185b5869a5ed",
            title: "Three Forks Cape",
            image: "https://images.unsplash.com/photo-1566419808810-658178380987?q=80&w=1000&auto=format&fit=crop",
            description: "Visit the historic lighthouse and stunning coastline",
            price: "From $30"
        },
        {
            id: "6743339ac1ae185b5869a5ed",
            title: "Local Seafood Experience",
            image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?q=80&w=1000&auto=format&fit=crop",
            description: "Taste fresh Mediterranean seafood at local restaurants",
            price: "From $45"
        }
    ]

    const handleExperienceClick = (id) => {
        navigate(`/hotel/${id}`);
    }
    return (
        <div className="experiencesContainer">
            <button 
                className="scrollButton left" 
                onClick={() => scroll('left')}
            >
                ←
            </button>
            <div className="moroccanExperiences " ref={scrollRef}>
                {nadorExperiences.map((exp, i) => (
                    <div className="experienceItem" key={i}>
                        <img src={exp.image} alt={exp.title} className="rounded-t-lg" />
                        <div className="experienceTitle">{exp.title}</div>
                        <div className="experienceDesc ps-1">{exp.description}</div>
                        <div className="experiencePrice ps-1 flex justify-between items-center ">
                            <div>{exp.price}</div>
                            <button className="experienceButton px-4 py-2 bg-orange-500 rounded-sm text-white me-4" onClick={() => handleExperienceClick(exp.id)}>View <FontAwesomeIcon icon={faArrowRight} /></button>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                className="scrollButton right" 
                onClick={() => scroll('right')}
            >
                →
            </button>
        </div>
    )
} 