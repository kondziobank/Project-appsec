import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { Carousel, CarouselItem, CarouselIndicators } from "reactstrap";

import img2 from "../../assets/images/users/avatar-2.jpg";
import img3 from "../../assets/images/users/avatar-3.jpg";
import img4 from "../../assets/images/users/avatar-4.jpg";

const CarouselPage = (props: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems([
      {
        id: 1,
        img: img2,
        name: "Jan Kowalski",
        designation: "Front-End Dev",
        description: props.t('carousel.description_1'),
      },
      {
        id: 2,
        img: img3,
        name: "Marcin Nowak",
        designation: "Senior Prolog Developer",
        description: props.t('carousel.description_2'),
      },
      {
        id: 3,
        img: img4,
        name: "Grzegorz Brzęczyszykiewicz",
        designation: "Dev Ops",
        description: props.t('carousel.description_3'),
      },
    ]);
  }, [])

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex: number) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map(item => {
    return (
      <CarouselItem
        tag="div"
        key={item.id}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        <div className="carousel-item active">
          <div className="testi-contain text-white">
            <i className="text-success display-6"></i>

            <h4 className="mt-4 fw-medium lh-base text-white">
              “{item.description}”
            </h4>
            <div className="mt-4 pt-3 pb-5">
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0">
                  <img
                    src={item.img}
                    className="avatar-md img-fluid rounded-circle"
                    alt="..."
                  />
                </div>
                <div className="flex-grow-1 ms-3 mb-4">
                  <h5 className="font-size-18 text-white">{item.name}</h5>
                  <p className="mb-0 text-white-50">{item.designation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CarouselItem>
    );
  });

  return (
    <React.Fragment>
      <div className="col-xxl-9 col-lg-8 col-md-7" style={{ position: 'fixed', right: '0', top: 0 }}>
        <div className="auth-bg pt-md-1 p-1 d-flex">
          <div className="bg-overlay bg-primary"></div>
          <div className="row justify-content-center align-items-center">
            <div className="col-xl-7">
              <div className="p-0 p-sm-4 px-xl-0">
                <div
                  id="reviewcarouselIndicators"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <CarouselIndicators
                    items={items}
                    activeIndex={activeIndex}
                    onClickHandler={goToIndex}
                  />
                  <Carousel
                    activeIndex={activeIndex}
                    next={next}
                    previous={previous}
                  >
                    {slides}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(CarouselPage);
