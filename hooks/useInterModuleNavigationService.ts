// mport { useServiceContext } from "@/context/ServiceContext";
// import { Navigation } from "@/core/constant";
// import { ServiceCategoryEnum } from "@/shared/enum/service-category.enum";
// import { SelfServiceHistoryModel } from "@/shared/models";
import { useRouter } from "next/navigation";

export const useInterModuleNavigationService = () => {
  const router = useRouter();

  // const { setService } = useServiceContext();

  const navigateTo = (path: string, data: any = null) => {
    router.push(path);
  };

  

  return {
    // navigateToLogin: () => navigateTo(Navigation.LOGIN),
    // toPayBill: () => navigateTo(Navigation.PAYBILL),
    // toDashboard: () => navigateTo(Navigation.DASHBOARD),
    // toFormRenderer: (service: any) => {
    //   setService(service);
    //   navigateTo(Navigation.FORM_RENDERER)
    // },
    // toSrDetails: (service: any) => {
    //   setService(service);
    //   navigateTo(Navigation.VIEW_SR_DETAILS)
    // },
    // toSelfServiceDetails: (service: SelfServiceHistoryModel) => {
    //   setService(service);
    //   navigateTo(Navigation.VIEW_SELF_SERVICE_HISTORY_DETAILS)
    // },
    // toLineDetailes: (msisdn: any) => {
    //   setService(msisdn);
    //   navigateTo(Navigation.LINE_DETAILS)
    // },
    // toOrderDetails: (opportunity:any) => {
    //   setService(opportunity);
    //   navigateTo(Navigation.VIEW_OPPORTUNITY)
    // },
    // toService: (serviceType: ServiceCategoryEnum) => {
    //   setService(serviceType);
    //   navigateTo(Navigation.SERVICES)
    // }
    // Add other navigation methods as needed
  };
};