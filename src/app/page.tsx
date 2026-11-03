import BannerOne from "@/components/banner/BannerOne";
import FeatureOne from "@/components/feature/FeatureOne";
import HeaderOne from "@/components/header/HeaderOne";
import DiscountProduct from "@/components/product/DiscountProduct";
import FeatureProduct from "@/components/product/FeatureProduct";
import WeeklyBestSelling from "@/components/product/WeeklyBestSelling";
import FeatureDiscount from "@/components/product/FeatureDiscount";
import TrandingProduct from "@/components/product/TrandingProduct";
import BlogOne from "@/components/blog/BlogOne";
import FooterOne from "@/components/footer/FooterOne";


export default function Home() {
  return (
    <div className="demo-one">
      <HeaderOne />
      <BannerOne />
      <FeatureOne />
      <FeatureProduct />
      <DiscountProduct />
      <WeeklyBestSelling />
      <FeatureDiscount />
      <TrandingProduct />
      <BlogOne />
      <FooterOne />
    </div>
  );
}
