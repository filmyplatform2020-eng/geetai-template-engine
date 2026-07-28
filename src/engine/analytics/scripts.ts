import type { AnalyticsConfig } from "./config"

export function injectScripts(config: AnalyticsConfig): string[] {
  const scripts: string[] = []

  if (config.ga4) {
    scripts.push(`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${config.ga4.measurementId}');
    `)
    scripts.push(`https://www.googletagmanager.com/gtag/js?id=${config.ga4.measurementId}`)
  }

  if (config.gtm) {
    scripts.push(`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${config.gtm.containerId}');
    `)
  }

  if (config.clarity) {
    scripts.push(`
      (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window,document,'clarity','script','${config.clarity.projectId}');
    `)
  }

  if (config.meta) {
    scripts.push(`
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${config.meta.pixelId}');
      fbq('track', 'PageView');
    `)
  }

  if (config.pinterest) {
    scripts.push(`
      !function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.q.push(
      Array.prototype.slice.call(arguments))};var
      n=window.pintrk;n.q=[],n.version="3.0";var
      t=document.createElement("script");t.async=!0,t.src=e;var
      r=document.getElementsByTagName("script")[0];
      r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
      pintrk('load', '${config.pinterest.tagId}');
      pintrk('page');
    `)
  }

  return scripts
}
