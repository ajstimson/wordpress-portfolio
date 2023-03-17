import React, { useEffect, useState } from "react"
import Head from "next/head";
import { components } from "./components";
import { Page as PageModel } from "./types";
import { Breadcrumbs } from "./page-components/breadcrumbs/breadcrumbs";
import { WORDPRESS_URL } from '../../modules/cms/config/config'

type PageProps = {
  data: PageModel
}

export const Page: React.FC<PageProps> = ({ data }) => {
  useEffect(() => {
    
    function filterNone() {
      return NodeFilter.FILTER_ACCEPT;
  }
  
  function addMoreClass(el) {
      // Fourth argument, which is actually obsolete according to the DOM4 standard, is required in IE 11
      const iterator = document.createNodeIterator(el, NodeFilter.SHOW_COMMENT, null );
      var currentNode;
      while (currentNode = iterator.nextNode()) {
        if (currentNode.nodeValue === 'more'){
          currentNode.parentNode.classList.add('more');
          let moreLink = document.createElement('a');
              moreLink.classList.add('read-more');
              moreLink.setAttribute('href',"#");
              moreLink.innerHTML = "Read More";

          currentNode.parentNode.appendChild(moreLink);
        }
      }
  }

  function hideAfterMore(el){
    let target = el.getElementsByClassName('more');
    for (let i = 0; i < target.length; i++) {

      target[i].parentNode.classList.add('more-container');

      const targetIndex = getTargetIndex(target[i]);
      setSibClass(target[i], targetIndex);

      target[i].addEventListener('click', function(e) {
        let thisItem = this;
        thisItem.onClick = toggleSibs(target[i]);
        thisItem.classList.toggle('active');
        // console.log(thisItem.firstChild)
        const link = thisItem.querySelector('a');

        if(thisItem.classList.contains('active')){
          link.text = 'Read Less'
        } else {
          link.text = 'Read More'
        }
        e.preventDefault();                        
    });
    }
  }

  let getTargetIndex = function (e) {
    // if no parent, return no sibling
    if(!e.parentNode) {
        return;
    }

    // first child of the parent node
    let sibling  = e.parentNode.firstChild;
  
    // collecting siblings
    let targetIndex;
    let i=0;
    while (sibling) {
      i++;
        if (sibling === e) {
          targetIndex = i;
        }

        sibling = sibling.nextSibling;
    }
    return targetIndex;
};

function setSibClass(target, index){
  let sibling  = target.parentNode.firstChild;
    // collecting siblings
    let targetIndex;
    let j=0;
    while (sibling) {
      j++;
        if (sibling.nodeType === 1 && j > index ) {
          sibling.classList.add('read-soon');
        }

        sibling = sibling.nextSibling;
    }
    return targetIndex;
}

function toggleSibs(target){
  let sibling  = target.parentNode.firstChild;
    // collecting siblings
    let targetIndex;
    let j=0;
    while (sibling) {
        if (sibling.nodeType === 1 && sibling.classList.contains('read-soon')) {
          sibling.classList.remove('read-soon');
          sibling.classList.add('reading');
        } else
        if (sibling.nodeType === 1 && sibling.classList.contains('reading')) {
          sibling.classList.add('read-soon');
          sibling.classList.remove('reading');
        }

        sibling = sibling.nextSibling;
    }
    return targetIndex;
}


function replace_url(elem, attr) {
  var elems = document.getElementsByTagName(elem);
  for (var i = 0; i < elems.length; i++)
      elems[i][attr] = elems[i][attr].replace('http:', 'https:');
}

function setStandaloneLinks(main) {
  const a = main.querySelectorAll('.content a')
    for (let i = 0; i < a.length; i++) {
      let parent = a[i].parentNode;
      let children = parent.childNodes;
      let standalone = detectCase(parent, children);

      if (standalone === true){
        for (let j = 0; j < children.length; j++) {
          let child = children[j]
          if(child.nodeName === 'A' && child.textContent.slice(-1) !== '»'){
            child.textContent = child.textContent + ' »';
          }
          if(child.nodeType === 3){
            const span = document.createElement('span');
            child.after(span);
            span.appendChild(child);
          }
        }
        parent.classList.add('standalone-link', 'discrete');
      }
      
    }
}

function detectCase(parent, children){
    if (parent.nodeName === 'P'){
      switch (children.length) {
      case 1:
        if (children[0].nodeName === 'A' && 
        !children[0].classList.contains('staff-link') &&
        !children[0].classList.contains('button')  ){
          return true;
        }
      case 2:
        if (children[0].nodeName === 'A' && children[1] && 
            !children[0].classList.contains('button') &&
            children[1].nodeName === 'A' &&
            !children[0].classList.contains('button')){
          return true;
        }
      case 3:
        if (  children[0].nodeName === 'A' && 
              children[1] &&
              children[1].nodeType === 3 && 
              children[1].length < 6 &&
              children[2] &&
              children[2].nodeName === 'A'){
          return true;
        }
      default:
        return false;
    }
  } else {
    return false;
  }
}
  
  window.addEventListener("load", function() {
      const main = document.querySelector('main');
      addMoreClass(main);
      hideAfterMore(main);
      // replace_url('a', 'href');
      // replace_url('img', 'src');
      setStandaloneLinks(main);

      const emptyAccordion =  document.querySelector('.accordion-section.items-0');

      if(emptyAccordion){
        emptyAccordion.remove();
      }

      let width = window.innerWidth;

      const tabs = document.querySelector('.tabs-section');
      if (tabs){
        
        const collapse = assessTabCollapse(width, tabs);
        const tabTitles = tabs.querySelectorAll('label')
        const tabContent = tabs.querySelectorAll('.tab-content')
        
        const tabAct = (tabTitles, tabContent) => {
          tabs.classList.add('collapse');
          for (let i = 0; i < tabTitles.length; i++) {
                let title = tabTitles[i];
                let content = tabContent[i];

                content.prepend(title);

          }
        }
        if(collapse === true){
          tabAct(tabTitles, tabContent)
          window.addEventListener("resize", () => {
            tabAct(tabTitles, tabContent);
          });
        }

      }
    });
    
    function assessTabCollapse(width, section){
      const el = section.querySelector('.tabs').classList;
      const count = parseInt(el[1].slice(-1), 10);
        if (width < 969 && count > 3) {
            return true;
        } else 
        if (width < 668 && count === 3){
          return true;
        } else {
          return false;
        }
    }
  }, [data])
    let indexState = 'noindex';
    if (process.env.NODE_ENV === 'production'){
      indexState = 'index'
    }
    
    let url = new URL('https://example.com')
    if (process.env.NODE_ENV !== 'production'){
      url = new URL('https://dev.example.com')
    }
    const canonical = url.href.replace(/\/$/, '');
    
  return (
    <>
      <Head>
        <title>{data.meta.title}</title>
        <meta name='title' content={data.meta.properties.title} />
        <link rel='canonical' href={canonical} />
        <meta name='description' content={data.meta.properties.description} />
        <meta name='robots' content={indexState + ', ' + data.meta.properties.robots.follow + ', '+ data.meta.properties.robots.max_snippet + ', '+ data.meta.properties.robots.max_image_preview + ', '+  data.meta.properties.robots.max_video_preview} />
        <meta name='og_url' content= {canonical} />
        <meta name='og_description' content={data.meta.properties.og_description} />
        <meta name='og_locale' content={data.meta.properties.og_locale} />
        <meta name='og_site_name' content={data.meta.properties.og_site_name} />
        <meta name='og_type' content={data.meta.properties.og_type} />
        <meta name="facebook-domain-verification" content="195tv3090ufxxgmn0h1niflv6jo2d2" />

            {/* {data.meta.properties.map((property) => {
              return (
                <meta
                  key={property.name}
                  name={property.name}
                  content={property.content}
                />
              );
            })}
            {data.meta.properties.map(({ property, content }) => (
              <meta key={property} property={property} content={content} />
            ))} */}
      </Head>
      <main id="main-content" className={`the-page-main ${data.meta.template}`}>
        { data.meta.template !== 'template-landing' && <Breadcrumbs items={data.meta.breadcrumbs} /> }
        { data.components?.[0]?.type !== 'Marquee' && 
            <section className="marquee simple"><div className="liner"><h1 dangerouslySetInnerHTML={{__html: data.meta.pageTitle}} /></div></section>
        }
        {data.components.map((value, index) => {
          const Component = components[value.type];

          if (!Component) {
            console.log(`Did not find component ${value.type} `);
            return null
          } 
          return <Component key={index} {...value} />;
        })}
      </main>
    </>
  );
};


