import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import './SuggestRecipe.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const options = [
  {
    title: 'Quick Bites',
    desc: 'Fast, tasty recipes for busy days.',
    path: '/suggest/quickbites'
  },
  {
    title: 'Calorie Smart',
    desc: 'Light on calories, big on flavor.',
    path: '/suggest/calories'
  },
  {
    title: 'Kids Favorites',
    desc: 'Yummy meals your kids will love.',
    path: '/suggest/kids'
  },
  {
    title: 'Sweet Tooth',
    desc: 'Satisfy your dessert cravings.',
    path: '/suggest/sweet'
  },
  {
    title: 'Cook What You Have',
    desc: 'Tell us what you have — we will suggest.',
    path: '/suggest/available'
  }
];

const SuggestRecipe = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true
        }
      }
    ]
  };

  return (
    <div className="suggest-container">
      <h2 className="suggest-heading">What are you craving today? 😋</h2>

      <Slider {...settings}>
        {options.map((card, idx) => (
          <div
            key={idx}
            className="suggest-card"
            onClick={() => navigate(card.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(card.path)}
          >
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SuggestRecipe;
