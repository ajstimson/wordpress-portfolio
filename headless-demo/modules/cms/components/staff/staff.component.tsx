import React from "react";
import { StaffProps } from "./staff.type";

export const StaffComponent: React.FC<StaffProps> = ({
  title,
  staff
}) => {
  // console.log(staff)
  return(
    <>
      {staff.length > 0 &&
        <section className="staff-section">
            <div className="liner">
              <div className="header-wrap">
                <h2>{title ? title : 'Staff & Faculty'}</h2>
                <div className="ornament" />
              </div>
              <div className={"staff grid item-count-" + staff.length}>
              {staff.map(({ status, name, title, image, phone, email }, index) => (
              <div className={image ? 'image' : 'no-image' + ' staff-member'} key={index}>
                {image && 
                <div className="image-holder">
                    <img src={image.url} alt={image.alt}></img>
                  </div>
                  }
                <div className="content">
                  <h4>{name}</h4>
                  <p>{title}</p>
                  <p><a className="staff-link" href={"mailto:" + email}> Email »</a></p>
                  <p><a className="staff-link" href={"tel:" + phone}>{[phone]}</a></p>
                </div>
              </div>
              ))}
              </div>
            </div>
        </section>
      }
    </>
    )
  };