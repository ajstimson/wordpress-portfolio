import React from "react";

const xml = 
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url>
    <loc>https://example.com</loc>
    <lastmod>2022-02-07T17:52:00+00:00</lastmod>
    <priority>1.00</priority>
</url>
<url>
    <loc>https://example.com/academics</loc>
    <lastmod>2021-06-12T22:00:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/resources</loc>
    <lastmod>2021-06-12T22:00:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/about/board/contact-board</loc>
    <lastmod>2021-07-15T01:56:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/middle-school/6-8-curriculum</loc>
    <lastmod>2021-08-07T02:09:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/curriculum</loc>
    <lastmod>2021-08-07T04:18:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/non-discrimination-notice</loc>
    <lastmod>2021-08-07T04:27:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/about/hass</loc>
    <lastmod>2021-08-08T19:21:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/about</loc>
    <lastmod>2021-08-11T23:36:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/contact-us/request-info</loc>
    <lastmod>2021-08-31T02:13:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/resources/for-students/transcript-request</loc>
    <lastmod>2021-08-31T03:01:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/english-learner-program</loc>
    <lastmod>2021-09-01T22:01:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/high-school/9-12-curriculum</loc>
    <lastmod>2021-09-03T07:30:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/about/team</loc>
    <lastmod>2021-09-03T17:23:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/section-504</loc>
    <lastmod>2021-09-03T18:52:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/terms-and-conditions</loc>
    <lastmod>2021-09-06T23:10:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/privacy-policy</loc>
    <lastmod>2021-09-07T16:30:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/mtss</loc>
    <lastmod>2021-09-07T16:50:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/about/child-find-policy</loc>
    <lastmod>2021-09-07T17:08:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/about/careers</loc>
    <lastmod>2021-09-07T17:12:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/programs-special-education</loc>
    <lastmod>2021-09-08T00:02:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/talented-and-gifted</loc>
    <lastmod>2021-09-08T00:13:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/resources/tech-support</loc>
    <lastmod>2021-09-13T19:36:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/resources/faq</loc>
    <lastmod>2021-09-16T20:39:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/admissions/how-it-works</loc>
    <lastmod>2021-09-16T23:05:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/elementary-school/k-5-curriculum</loc>
    <lastmod>2021-09-17T00:55:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/student-support</loc>
    <lastmod>2021-09-17T00:55:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/enroll</loc>
    <lastmod>2021-09-27T21:14:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/elementary-school/k-5-clubs</loc>
    <lastmod>2021-10-11T21:00:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/high-school/9-12-clubs</loc>
    <lastmod>2021-10-11T21:01:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/middle-school/6-8-clubs</loc>
    <lastmod>2021-10-11T21:01:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/about/who-we-are</loc>
    <lastmod>2021-10-11T21:16:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/resources/for-families-and-learning-coaches</loc>
    <lastmod>2021-11-05T01:48:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/news-and-events/calendar</loc>
    <lastmod>2021-11-05T03:57:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/admissions/why-orva</loc>
    <lastmod>2021-11-23T22:33:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/admissions/how-to-enroll</loc>
    <lastmod>2021-11-23T22:34:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/admissions/expectations-online-school</loc>
    <lastmod>2021-12-07T22:22:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/resources/for-families-and-learning-coaches/testing-and-assessments</loc>
    <lastmod>2021-12-13T19:36:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/about/equity</loc>
    <lastmod>2022-01-13T21:36:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/resources/for-students</loc>
    <lastmod>2022-01-13T21:40:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/test-resources-page-component</loc>
    <lastmod>2022-01-21T20:43:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/high-school/high-school-programs</loc>
    <lastmod>2022-01-29T02:10:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/news-and-events</loc>
    <lastmod>2022-02-07T17:53:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/news-and-events/newsletters</loc>
    <lastmod>2022-02-07T17:54:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/resources/accessibility</loc>
    <lastmod>2022-02-11T05:54:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/resources/getting-started</loc>
    <lastmod>2022-02-11T18:15:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/contact-us</loc>
    <lastmod>2022-02-11T18:39:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/middle-school</loc>
    <lastmod>2022-02-11T18:42:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/elementary-school</loc>
    <lastmod>2022-02-11T18:47:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/about/board</loc>
    <lastmod>2022-02-11T20:41:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/high-school/school-counseling</loc>
    <lastmod>2022-02-11T21:11:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
<url>
    <loc>https://example.com/academics/high-school</loc>
    <lastmod>2022-02-11T21:26:00+00:00</lastmod>
    <priority>0.80</priority>
</url>
</urlset>`


const Sitemap = () => {};

export const getServerSideProps = ({ res }) => {

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();

  return {
    props: {},
  };


};
export default Sitemap