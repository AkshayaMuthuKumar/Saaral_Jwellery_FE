import React, { useRef, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import { Carousel } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import '../src/style.css';
import axios from 'axios'; 
import API_URL from './config';

export default function JewelryShop() {
  const tealColor = '#009688';
  const darkColor = '#343a40';

  const [categories, setCategories] = useState([]); 

  const navigate = useNavigate();

  // Ref for Slick carousel
  const sliderRef = useRef(null);

  const handleQuickView = (category) => {
    navigate(`/jewelry/${category}`);
  };

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // State to track if the video is playing

  useEffect(() => {
    const video = videoRef.current;

    const handlePlayPause = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Only play the video if it's not already playing
          if (!isPlaying && video) {
            video.play().then(() => {
              setIsPlaying(true); // Set the state to playing
            }).catch((error) => {
              console.error('Error playing the video:', error);
            });
          }
        } else {
          // Only pause the video if it's playing
          if (isPlaying && video) {
            video.pause();
            setIsPlaying(false); // Set the state to paused
          }
        }
      });
    };

    const observer = new IntersectionObserver(handlePlayPause, {
      threshold: 0.5, // Play when 50% of the section is visible
    });

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      observer.observe(aboutSection);
    }
    return () => {
      if (aboutSection) {
        observer.unobserve(aboutSection);
      }
    };
  }, [isPlaying]); useEffect(() => {
    const video = videoRef.current;



    const handlePlayPause = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // If the video is not playing, attempt to play it
          if (!isPlaying && video && video.paused) {
            video.play().then(() => {
              setIsPlaying(true); // Set the state to playing
            }).catch((error) => {
              console.error('Error playing the video:', error);
            });
          }
        } else {
          // If the video is playing, pause it
          if (isPlaying && video && !video.paused) {
            video.pause();
            setIsPlaying(false); // Set the state to paused
          }
        }
      });
    };

    const observer = new IntersectionObserver(handlePlayPause, {
      threshold: 0.5, // Play when 50% of the section is visible
    });

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      observer.observe(aboutSection);
    }

    return () => {
      if (aboutSection) {
        observer.unobserve(aboutSection);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/categories`); // Adjust the URL as necessary
        const categoryData = response.data.categories.map(category => ({
          name: category.category_name,
          image: category.image // Store image alongside the name
        }));

        setCategories(categoryData); // Set state to include both names and images
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);


  const handleCategoryClick = (index) => {
    // Scroll the carousel to the respective category
    sliderRef.current.slickGoTo(index);
  };

  const carouselCaptionStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleVideoPlay = () => {
    const video = videoRef.current;
    if (video) {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Error playing the video:', error);
      });
    }
  };

  const handleVideoPause = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <Carousel className="animate__animated animate__fadeIn animate__delay-1s" style={{ backgroundColor: darkColor }}>
        <Carousel.Item>
          <img className="d-block w-100" src="images/caro1.jpg" alt="First slide" style={{ height: '600px', objectFit: 'cover' }} />
          <Carousel.Caption style={carouselCaptionStyle}>
            <h3>Exclusive Collection</h3>
            <p>Discover our exclusive range of luxury jewelry.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src="images/caro2.jpg" alt="Second slide" style={{ height: '600px', objectFit: 'cover' }} />
          <Carousel.Caption style={carouselCaptionStyle}>
            <h3>Elegant Designs</h3>
            <p>Find the perfect piece to match your style.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src="images/caro3.jpg" alt="Third slide" style={{ height: '600px', objectFit: 'cover' }} />
          <Carousel.Caption style={carouselCaptionStyle}>
            <h3>Timeless Beauty</h3>
            <p>Jewelry that will be cherished for a lifetime.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Main Content */}
      <div className="container py-5" id="collection">
        <div className="text-center mb-4 animate__animated animate__fadeInUp">
          <b><h2 style={{ color: tealColor, marginBottom: '1rem' }}>Find Your Sparkle</h2></b>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
            {categories.map((category, index) => (
              <React.Fragment key={category}>
                <span
                  style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: tealColor, margin: '0 5px', cursor: 'pointer' }}
                  onClick={() => handleCategoryClick(index)} // Center the respective card
                ></span>
                <span
                  style={{ margin: '0 10px', fontSize: '16px', color: 'black', cursor: 'pointer' }}
                  onClick={() => handleCategoryClick(index)} // Center the respective card
                >
                  {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Product Carousel */}
        <Slider ref={sliderRef} {...settings}>
          {categories.map((category, index) => (
            <div className="p-2" key={category.name}> {/* Use category.name for the key */}
              <div className="card-container">
                <div className="card h-100 shadow-sm animate__animated animate__zoomIn">
                  <img
                    src={category.image} // Use the image path from the category data
                    alt={`${category.name}`} // Use the category name for alt text
                    className="card-img-top"
                    style={{ height: '320px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <button className="quick-view-btn" onClick={() => handleQuickView(category.name)}>
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>

      </div>

      {/* About Section */}
      <div className="container py-5 animate__animated animate__fadeIn bg-light" id="about" style={{ height: '653px' }}>
        <h2 style={{ color: 'teal' }} className='text-center'>About Us</h2>
        <div className="row">
          <div className="col-md-4">
            <video
              ref={videoRef}
              controls
              className="img-fluid rounded m-6 p-6"
              style={{ maxWidth: '300%', height: '40%' }}
              onMouseEnter={handleVideoPlay}
              onMouseLeave={handleVideoPause}
            >
              <source src="/images/About Saaral.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="col-md-6 text-center ">
            <p className="mt-5">
              At Saaral Jewellery, we are committed to delivering luxury and elegance in every piece. Our collection
              is crafted with attention to detail, merging timeless designs with modern trends. From statement pieces
              to everyday classics, we cater to a wide variety of styles. Our mission is to ensure that every piece you
              wear not only complements your outfit but also reflects your individuality.
            </p>
            <p className="mt-3">
              With decades of experience in the jewelry industry, we focus on craftsmanship, authenticity, and customer
              satisfaction. We source our materials responsibly and work with skilled artisans to create exquisite pieces
              that will last for generations. Join us in celebrating the art of fine jewelry, and let your style shine through
              our creations.
            </p>
          </div>
        </div>
      </div>


      <div className="container py-5 mb-4" id="testimonials">
        <h2 className="text-center mb-4 animate__animated animate__fadeInLeft" style={{ color: 'teal' }}>
          Locate Us   </h2>
        <div className="row">
          <div className="col-md-4 text-center">
            <h4><b>Saaral Jewellery</b></h4>

            <a className="btn-floating mb-4" style={{ color: 'teal' }}>
              <i className="fas fa-map-marker-alt"></i>
            </a>
            <p>A385/101, Jayakumar Plaza, Saradha College Road</p>
            <p>Alagapuram, Salem, India, TamilNadu</p>
            <p>+91 8667839474</p>
            <a className="btn-floating mb-4" style={{ color: 'teal' }} href="mailto:info@saaraljewellery.com">
              <i className="fas fa-envelope"></i>
            </a>
            <p><a href="mailto:info@saaraljewellery.com">saaraljewellery@gmail.com</a></p>
          </div>

          {/* Map */}
          <div className="col-md-8">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.245842939958!2d78.13843267481901!3d11.676981488531906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf13f55b9d9cd%3A0xf98b2b1d1e6f5659!2sSAARAL%20JEWELLERY!5e0!3m2!1sen!2sus!4v1726649895710!5m2!1sen!2sus"
                style={{
                width: "850px",
              height: "300px",
              border: '0',
              position: 'absolute',
                 
              }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
             ></iframe>
           
          </div>

        </div>
      </div>


      <footer className="text-white text-center py-4 animate__animated animate__fadeInUp" id="contact" style={{ backgroundColor: tealColor, marginTop: '190px' }}>
        <p>&copy; 2024 Saaral Jewellery. All Rights Reserved.</p>
        <div>
          <a href="https://www.facebook.com/profile.php?id=61551411777609" className="text-white mx-2" aria-label="Facebook">
            <i className="fab fa-facebook" style={{ color: 'white' }}></i>
          </a>
          <a href="https://www.instagram.com/saaral_jewellery/" className="text-white mx-2" aria-label="Instagram">
            <i className="fab fa-instagram" style={{ color: 'white' }}></i>
          </a>
        
        </div>
      </footer>
    </div>
  );
}