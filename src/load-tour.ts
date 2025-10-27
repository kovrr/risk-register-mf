const TOUR_ID = '904';

export const loadTour = () => {
  (window as any).Produktly?.startTour({ tourId: TOUR_ID });
};
