import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import PopupModal from "../../Components/PopUpModal/PopUpModal";
import FilterDropdowns from "../../Components/Navbar/FilterDropdownsData";
import { useDispatch } from "react-redux";
import Footer from "../../Components/Footers/Footer.jsx";
import { hideLoading, showLoading } from "../../Redux/Slices/loadingSlice.jsx";
import Navbar from "../../Components/Navbar/NavBar.jsx";
import SEO from "../../Components/SEO/Seo.jsx";
import HomeBanner from "../../assets/Images/HomeBanner.avif";
import CompareButton from "./CompareButtonsCompenents.jsx";

// --- ErrorBoundary ---
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Box p={3} textAlign="center" bgcolor="#fff5f5">
          <Typography color="error">
            Failed to load: {this.state.error?.message}
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

// --- LazyCard and VirtualizedCardList for scalable, virtualized sections ---
const LazyCard = React.memo(({ component: CardComponent, index, style }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "400px",
  });
  return (
    <div ref={ref} style={style}>
      {inView ? (
        <Suspense
          fallback={
            <Box
              minHeight={100}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CircularProgress size={24} color="success" />
            </Box>
          }
        >
          <CardComponent key={index} />
        </Suspense>
      ) : (
        <div style={{ height: "100%", backgroundColor: "#f5f5f5" }} />
      )}
    </div>
  );
});
const VirtualizedCardList = React.memo(
  ({ items, itemHeight = 400, componentProps }) => {
    const CardRow = ({ index, style }) => (
      <LazyCard
        component={items[index]}
        index={index}
        style={style}
        {...componentProps}
      />
    );
    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={items.length}
            itemSize={itemHeight}
            width={width}
            style={{ overflowX: "hidden" }}
          >
            {CardRow}
          </List>
        )}
      </AutoSizer>
    );
  }
);

// --- ComponentLoader to fully wrap lazy components with error and suspense ---
const ComponentLoader = React.memo(({ Component, ...props }) => (
  <ErrorBoundary>
    <Suspense
      fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      }
    >
      <Component {...props} />
    </Suspense>
  </ErrorBoundary>
));

// -- pageConfig, bannerTexts, animation objects here (same as your code) --
const bannerTexts = [
  {
    title: {
      text: "1000+ Food Brands \n One Platform Endless Possibilities",
      gradient:
        "linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Discover A Universe Of F&B Franchise Opportunities From Quick Service Restaurants To Gourmet Cafes All Under On Powerful Portal",
      highlight: {
        text: " F&B franchise opportunities",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Turn Your Investment \n Into A Tasteful Venture",
      gradient: "linear-gradient(90deg, #ffffffff 10%, #ffffffff 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Explore Curated Restaurant And Cafe Franchises With Proven Models Designed For ROI Stability And Low Opertational Hassle",
      highlight: {
        text: " proven models",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "India's #1 F&B Franchise Marketplace\n Your Food Business Starts Here",
      gradient:
        "linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "From Startup Food kiosks To International Food Chains We Have Everything You Need To Start Your Franchise ",
      highlight: {
        text: "food franchise journey",
        color: "#ff9800",
        lineHeight: "1.5",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Serve Success Hot \n Choose the Right F&B Franchise Today",
      gradient: "linear-gradient(90deg, #ffffffff 10%, #ffffffff 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Invest in hot-selling food concepts with high demand, fast scalability, and support from trusted food brands ",
      highlight: {
        text: "F&B Franchise",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "From Local Taste to Global Plates \n Start Your Food Business Now",
      gradient:
        "linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Franchise options available in street food, bakeries, ice cream parlors, multicusine restaurants, and more.",
      highlight: {
        text: "Food Business",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Low Investment.\nHigh Appetite for Growth",
      gradient: "linear-gradient(90deg, #ffffffff 10%, #ffffffff 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Start from just ₹5 Lakhs with multiple profitable options in cafes, cloud kitchens, and food trucks.",
      highlight: {
        text: "Low Investment",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Franchise a Restaurant.\n Own a Cafe Lead a Cloud Kitchen",
      gradient:
        "linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Find franchise businesses across every food format to suit your budget, location, and business dream.",
      highlight: {
        text: "franchise businesses",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "F&B Franchise Made Easy \n with www.MrFranchise.in",
      gradient: "linear-gradient(90deg, #ffffffff 10%, #ffffffff 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Step-by-step guidance, brand comparisons, and expert consultation to help you confidently invest.",
      highlight: {
        text: "consultation",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "No Experience? No Problem!\n Proven Food Franchise Models Await You",
      gradient:
        "linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Get full training, support, marketing tools, and setup assistance with our zero-hassle franchise options.",
      highlight: {
        text: "zero-hassle",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Your Food Franchise Future\n Starts At food and beverage www.MrFranchise.in",
      gradient: "linear-gradient(90deg, #ffffffff 10%, #ffffffff 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "The one-stop portal for serious F&B investors looking to explore, compare, and close franchise deals.",
      highlight: {
        text: "franchise deals",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
];

const pageConfig = {
  heroBanner: {
    backgroundImage: HomeBanner,
    overlayColor: "rgba(0, 0, 0, 0.3)",
    title: {
      text: "Welcome To Our MrFranchise Network",
      gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" },
    },
    subtitle: {
      text: "World's most comprehensive franchise platform with 1000+ opportunities waiting for you...",
      highlight: {
        text: "1000+ opportunities",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  // ...rest unchanged
  sections: [
    { component: "TopBrandThreevdocards", background: "#fff" },
    { component: "HomeSection1", background: "#fff" },
    { component: "HomeSection2", background: "#fff" },
    { component: "HomeSection3", background: "#fff" },
    { component: "HomeSection4", background: "#fff" },
    { component: "HomeSection5", background: "#fff" },
    { component: "HomeSection6", background: "#fff" },
    { component: "HomeSection7", background: "#fff" },
    { component: "HomeSection8", background: "#fff" },
    { component: "HomeSection9", background: "#fff" },
    { component: "HomeSection10", background: "#fff" },
    { component: "LikedBrands", background: "#fff" },
    { component: "ViewBrands", background: "#fff" },
    { component: "ShortlistBrands", background: "#fff" },
    { component: "FindFranchiseLocations", background: "#fff" },
    { component: "ToTrendingBrands", title: "Trending Brands", background: "#fff" },
  ],
  animations: {
    banner: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { when: "beforeChildren", staggerChildren: 0.3 },
      },
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", damping: 10, stiffness: 100 },
      },
    },
    pulse: {
      scale: [1, 1.02, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  },
};

const useDynamicComponents = () => {
  return React.useMemo(() => {
    // Gather all potential modules in this folder (adjust extension if needed)
    const modules = import.meta.glob(
      "../../Components/HomePage_VideoSection/*.jsx",
      {
        eager: false,
      }
    );

    // Map of logical name -> file name (adjust to your real files)
    const entries = [
      { key: "TopBrandThreevdocards", file: "TopBrandThreeVdoCards.jsx" },
      { key: "HomeSection1", file: "HomeSection1.jsx" },
      { key: "HomeSection2", file: "HomeSection2.jsx" },
      { key: "HomeSection3", file: "HomeSection3.jsx" },
      { key: "HomeSection4", file: "HomeSection4.jsx" },
      { key: "HomeSection5", file: "HomeSection5.jsx" },
      { key: "HomeSection6", file: "HomeSection6.jsx" },
      { key: "HomeSection7", file: "HomeSection7.jsx" },
      { key: "HomeSection8", file: "HomeSection8.jsx" },
      { key: "HomeSection9", file: "HomeSection9.jsx" },
      { key: "HomeSection10", file: "HomeSection10.jsx" },
      { key: "LikedBrands", file: "LikedBrands.jsx" },
      { key: "ShortlistBrands", file: "ShortlistBrands.jsx" },
      { key: "ViewBrands", file: "ViewBrands.jsx" },
      { key: "ToTrendingBrands", file: "ToTrendingBrands.jsx" },
      { key: "FindFranchiseLocations", file: "FindFranchiseLocations.jsx" },
    ];

    const map = {};

    entries.forEach(({ key, file }) => {
      const path = `../../Components/HomePage_VideoSection/${file}`;
      console.log("Checking for module:", path);


      // Only if the module exists, create a lazy component
      if (path in modules) {
        // You can either wrap with your existing preload wrapper or use React.lazy directly
        // If you want to keep your createLazyWithPreload, do:
        // map[key] = createLazyWithPreload(() => modules[path]().then(m => m));
        // Here, using React.lazy for simplicity:
        map[key] = React.lazy(modules[path]);
      }
    });

    return map;
  }, []);
};

// --- Section that lazy loads content on scroll-in-view, preloads just before ---
const LazySection = ({
  componentKey,
  dynamicComponents,
  background,
  ...props
}) => {
  const Component = dynamicComponents[componentKey];
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });
  useEffect(() => {
    if (inView && Component.preload) {
      Component.preload();
    }
  }, [inView, Component]);
  return (
    <Box ref={ref} py={8} bgcolor={background}>
      <Container maxWidth="xl">
        {inView ? (
          <ComponentLoader
            Component={Component}
            VirtualizedCardList={VirtualizedCardList}
            LazyCard={LazyCard}
            {...props}
          />
        ) : (
          <Box minHeight={200} />
        )}
      </Container>
    </Box>
  );
};

// --- Main component ---
const HomeBannerSec = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const dynamicComponents = useDynamicComponents();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
  const navigate = useNavigate();
  useEffect(() => {
    const nav =
      performance.getEntriesByType("navigation")[0]?.type === "reload";
    const shown = sessionStorage.getItem("popup-shown");
    dispatch(showLoading());
    const t = setTimeout(() => {
      setIsLoading(false);
      dispatch(hideLoading());
      if (!shown || nav) {
        setIsPopupOpen(true);
        sessionStorage.setItem("popup-shown", "true");
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      controls
        .start({
          opacity: 0,
          x: -80,
          transition: { duration: 0.5 },
        })
        .then(() => {
          setBannerIndex((prev) => (prev + 1) % bannerTexts.length);
          controls.start({
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 },
          });
        });
    }, 5000);
    return () => clearInterval(interval);
  }, [controls, isLoading]);

  useEffect(() => {
    setShowPopup(!localStorage.getItem("accessToken") && isPopupOpen);
  }, [isPopupOpen]);

  const handlePopupClose = useCallback(() => setIsPopupOpen(false), []);
  const currentText = bannerTexts[bannerIndex];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="secondary" size={60} />
      </Box>
    );
  }

  return (
    <>
      <SEO
        title={`${currentText.title.text} | Top Franchise Opportunities in India 2025`}
        description={`${currentText.subtitle.text} Start your journey with the best franchise opportunities in India.`}
        keywords="franchise opportunities in India, top franchises India, food franchise India, low investment franchise India, cafe franchise, restaurant franchise, F&B business opportunities"
        canonical="https://mrfranchise.in/"
        url="https://mrfranchise.in/"
        image={
          currentText.images || "https://mrfranchise.in/images/hero-banner.jpg"
        }
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://mrfranchise.in/#organization",
          name: "Mr Franchise",
          url: "https://mrfranchise.in",
          logo: "https://mrfranchise.in/images/logo.png",
          sameAs: [
            "https://www.facebook.com/mrfranchise",
            "https://www.instagram.com/mrfranchise",
            "https://www.linkedin.com/company/mrfranchise",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+91-XXXXXXXXXX",
            contactType: "customer service",
            areaServed: "IN",
            availableLanguage: ["English", "Hindi"],
          },
        }}
        og={{
          type: "website",
          title: `${currentText.title.text} | Mr Franchise`,
          description: `${currentText.subtitle.text} Explore 1000+ franchise opportunities.`,
          image: "https://mrfranchise.in/images/social-share.jpg",
          imageWidth: "1200",
          imageHeight: "630",
        }}
        twitter={{
          card: "summary_large_image",
          site: "@MrFranchise",
          creator: "@MrFranchise",
          title: `${currentText.title.text} | Mr Franchise`,
          description: `${currentText.subtitle.text} India's #1 F&B Franchise Marketplace`,
          image: "https://mrfranchise.in/images/twitter-card.jpg",
        }}
        additionalMeta={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1, maximum-scale=1",
          },
          {
            name: "theme-color",
            content: "#FF5722",
          },
          {
            name: "apple-mobile-web-app-title",
            content: "Mr Franchise",
          },
        ]}
      />

      <Navbar />

      {showPopup && (
        <PopupModal
          open={isPopupOpen}
          onClose={handlePopupClose}
          disableInitialAnimation
        />
      )}

      {/* --- Hero Banner --- */}
      <Box
        mt={0}
        sx={{
          background: `linear-gradient(${pageConfig.heroBanner.overlayColor}), url(${pageConfig.heroBanner.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: isMobile ? "scroll" : "fixed",
          py: 1,
          position: "relative",
          overflow: "hidden",
          color: "white",
          minHeight: isMobile ? "75vh" : "40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container
          sx={{
            zIndex: 2,
            textAlign: "center",
            height: "100%",
            mt: 3,
          }}
        >
          <motion.div
            key={bannerIndex}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
          >
            <Typography mb={3} component="span">
              <Box
                sx={{
                  background: currentText.title.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "none",
                  display: "inline-block",
                  fontSize: isMobile ? "1.5rem" : "2.2rem",
                  fontWeight: 900,
                  px: 1,
                  whiteSpace: "pre-line",
                }}
              >
                {currentText.title.text}
              </Box>
            </Typography>
          </motion.div>

          <motion.div variants={pageConfig.animations.item}>
            <Typography
              variant={isMobile ? "body1" : "subtitle1"}
              mt={isMobile ? 0 : 3}
              sx={{
                textAlign: "center",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 700,
                mt: 2,
                mb: 5,
                maxWidth: "800px",
                mx: "auto",
                lineHeight: 1.5,
                fontSize: isMobile ? "0.6rem" : ".9rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                position: "relative",
              }}
              component={motion.div}
            >
              {
                currentText.subtitle.text.split(
                  currentText.subtitle.highlight.text
                )[0]
              }
              <Typography
                variant="outlined"
                sx={{
                  fontWeight: currentText.subtitle.highlight.fontWeight,
                  color: currentText.subtitle.highlight.color,
                  display: "inline",
                  mb: 5,
                }}
                component="span"
              >
                {currentText.subtitle.highlight.text}
              </Typography>
              {
                currentText.subtitle.text.split(
                  currentText.subtitle.highlight.text
                )[1]
              }
            </Typography>
          </motion.div>

          <FilterDropdowns />
        </Container>
      </Box>

      {pageConfig.sections
        .filter((section) => {
          // Show everything except login-required sections when logged out
          if (
            !isLoggedIn &&
            ["ViewBrands", "ShortlistBrands", "LikedBrands"].includes(
              section.component
            )
          ) {
            return false; // Skip these if logged out
          }
          return true;
        })
        .map((section, index) => (
          <LazySection
            key={index}
            componentKey={section.component}
            dynamicComponents={dynamicComponents}
            background={section.background || "#d5e7ddac"}
            isMobile={isMobile}
          />
        ))}

      {/* 👇 Add here, before Footer */}
      <CompareButton />

      <Footer />
    </>
  );
};

export default React.memo(HomeBannerSec); // Use React.memo to optimize HomeBannerSec
