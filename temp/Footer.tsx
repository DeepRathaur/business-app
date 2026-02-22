// components/Footer.tsx
import { ConfigContext } from "@/context/ConfigContext";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { StaticLinksModel } from "../models";

interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

interface FooterProps {
  socialLinks: SocialLink[];
  termsUrl?: string;
  privacyUrl?: string;
  contactUrl?: string;
  bgClass?: string;
}

const Footer: React.FC<FooterProps> = ({
  socialLinks,
  termsUrl = "/termCondition",
  privacyUrl = "/copyRightPrivacy",
  contactUrl = "/contact-us",
  bgClass,
}) => {
  const {config} = useContext(ConfigContext);
  const [link, setLink] = useState<StaticLinksModel>();

  useEffect(() => {
    if(config){
      setLink(config.result.public.STATIC_LINKS);
    }
  }, [config])
  const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_URL_ABC;
  const liteUrl = process.env.NEXT_PUBLIC_PRODUCTION_URL_ABC_LITE;
  const STORE_LOCATOR_URL = `${baseUrl}/storeLocator`;
  const OPEN_NETWORKS_URL = `${baseUrl}/openNetworks`;
  const FEEDBACK_URL = `${baseUrl}/give_your_feedback`;
  const customerRegistration = `${liteUrl}/register`;
  const media = `${baseUrl}/industry-media-entertainment`;

  return (
    <>
    </>
    // <footer className={`text-sm text-gray-600 space-y-6 p-4 ${bgClass}`}>
    //   <div>
    //     <h4 className="text-base font-bold mb-2 text-[#5F5F5F]">Customer Care</h4>
    //     <ul className="space-y-1">
    //       <li className="leading-6">
    //         <a
    //           href={customerRegistration}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className="hover:underline"
    //         >
    //           Customer Registration
    //         </a>
    //       </li>
    //       <li className="leading-6">
    //         <a
    //           href={link?.MEDIA}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className="hover:underline"
    //         >
    //           Media
    //         </a>
    //       </li>
    //     </ul>
    //   </div>

    //   <div>
    //     <h4 className="text-base font-bold mb-2 text-[#5F5F5F]">Help at Hand</h4>
    //     <ul className="space-y-1">
    //       <li className="leading-6">
    //         <a
    //           href={link?.CHECK_COVERAGE}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className="hover:underline"
    //         >
    //           Check Coverage
    //         </a>
    //       </li>
    //       <li className="leading-6">
    //         <a
    //           href={link?.FIND_A_STORE}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className="hover:underline"
    //         >
    //           Find a Store
    //         </a>
    //       </li>
    //       <li className="leading-6">
    //         <a
    //           href={link?.GIVE_US_YOUR_FEEDBACK}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className="hover:underline"
    //         >
    //           Give us your Feedback
    //         </a>
    //       </li>
    //     </ul>
    //   </div>

    //   <div>
    //     <h4 className="text-base font-bold mb-2 text-[#5F5F5F] ">We are here</h4>
    //     <div className="flex space-x-3 mt-2 text-gray-700">
    //       {socialLinks.map(({ name, icon, url }) => (
    //         <a
    //           key={name}
    //           href={url}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           data-link={name}
    //           className={`${name} leading-6 grayscale-[1]`}
    //           aria-label={name}
    //         >
    //           <Image src={icon} alt={name} width={24} height={24} />
    //         </a>
    //       ))}
    //     </div>
    //   </div>

    //   <div className="border-t border-[#00000033] mb-[5px]"></div>

    //   <div className="pt-4">
    //     <ul className="space-y-1">
    //       <li className="leading-6">
    //         <a
    //           href={link?.TERMS_AND_CONDITIONS}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className="hover:underline"
    //         >
    //           Terms & Conditions
    //         </a>
    //       </li>
    //       <li className="leading-6">
    //         <a
    //           href={link?.PRIVACY_POLICY}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className="hover:underline"
    //         >
    //           Copyright & Privacy
    //         </a>
    //       </li>
    //       <li className="leading-6">
    //         <a
    //           href={link?.CONTACT_US}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className="hover:underline"
    //         >
    //           Contact Us
    //         </a>
    //       </li>
    //     </ul>
    //   </div>

    //   <div className="pt-4 mb-0">
    //     <p className="text-[12px]">Airtel Business Care © 2021 Airtel Africa. All Rights Reserved.</p>
    //   </div>
    // </footer>
  );
};

export default Footer;
