import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import { WORDPRESS_URL } from '../../modules/cms/config/config'
import { preProcessResponse } from '../../modules/cms/utils/pre-process-response'
import { HeaderRaw } from '../../types/header-data'

function preProcess(content){
    content = content.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '');
    return content
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const response = await fetch(`${WORDPRESS_URL}/header/867`)

    const json = await preProcessResponse(response)   
    if (!json === true) {
        res.status(500).send("Internal Server Error")
        return
    }
    
    const data = json.acf

    const utility_header = data.utility_header;
    // const utility_contact = preProcess(data.utility_header.contact_info) 
    // TODO: Make this a loop
    const logo = data.main_header.logo
    const nav_menu = data.main_header.navigation_menu
    const enroll_button = data.main_header.enroll_button
    const request_info_button = data.main_header.request_info_button

    // TODO clean up unused data being sent to the browser, implement a normalize Header  
    // that takes all the acf + wp data and returns a json object that contains ONLY
    // the data that is actually used/needed
    // =>    rda    // const result = normalizeHeader({
    //     utility_header,
    //     logo,
    //     nav_menu,
    //     enroll_button,
    //     request_info_button
    // })

    res.status(200).json({
        utility_header,
        logo,
        nav_menu,
        enroll_button,
        request_info_button
    })
}   