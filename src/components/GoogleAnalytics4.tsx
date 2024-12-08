export const GoogleAnalytics4 = () => {
  return (
    <>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-DT9Y6614LF"
      ></script>

      <script
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-DT9Y6614LF');
  `,
        }}
      />
    </>
  );
};
