import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import { WORDPRESS_URL } from '../../modules/cms/config/config'
import { preProcessResponse } from '../../modules/cms/utils/pre-process-response';
import { FooterRaw } from '../../types/footer-data'


function socialLoop(items){
    let html = '';
    for (let i = 0; i < items.length; i++) {
        let item = items[i]
        let target = '';
        if (item.social_link.target.length > 0){
            target = item.social_link.target
        } else {
            target = '_self';
        }
        html += '<a class="social-' + item.social_link.title + '" target="' + target + '" href="' + item.social_link.url + '"><img src="' + item.image.url + '"></a> '
    }
    return html;
}

function subFooterListLoop(items){
    let html = '';
    for (let i = 0; i < items.length; i++) {
        let item = items[i].list_item
        let target = '';
        if (item.target.length > 0){
            target = item.target
        } else {
            target = '_self';
        }
        html += '<a class="sub_list_' + item.title + '" target="' + target + '" href="' + item.url + '">' + item.title + '</a> '
        if (i !== items.length - 1) {
            html += '| '
        }
        
    }
    return html;
}

function setYear(html){

    const year = new Date().getFullYear()
    
    // html = html.match(/></i)[1].replace(year)

    return html;
}

// function columnProcess(data){
//     let columns;

//     for (let i = 0; i < data.length; i++) {
//         columns = <div class=columns[i];
        
//     }
// }

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const response = await fetch(`${WORDPRESS_URL}/footer/906`)
    const json = await preProcessResponse(response);
    
    if (!json === true) {
        res.status(500).send("Internal Server Error")
        return
    }

    const data = json.acf

    const logo = data.main_footer.logo
    const main_content =  data.main_footer.columns
    const main_background = data.main_footer.background
    const social = socialLoop(data.main_footer.social)
    const statement = data.main_footer.descriptor
    const subFooterList = subFooterListLoop(data.sub_footer.list)
    const subFooterStatement = data.sub_footer.descriptor
    const utility_statement = setYear(data.utility_footer.copyright_message)

    res.status(200).json({
        logo,
        main_content,
        main_background,
        social,
        statement,
        subFooterList,
        subFooterStatement,
        utility_statement,
        data
    })
}