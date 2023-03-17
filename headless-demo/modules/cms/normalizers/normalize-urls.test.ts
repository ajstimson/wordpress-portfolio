import  {  removeTrailingSlashesInURLS, removeHostnameInAbsoluteUrls, normalizeUrls, addFileProxy, removeTrailingSlashesInUrlsInJSON } from './normalize-urls'

describe('modules/cms/normalizers/normalize-url', () => {
    describe('normalize-url', () => {
        it('normalizes url', () => {
            const target = `<a href="https://staging.example.com/academics/mtss/">ABSOLUTE URL</a>`
            const result = normalizeUrls(target)
            expect(result).toBe(`<a href="/academics/mtss">ABSOLUTE URL</a>`)
        })
    })

    describe('removeTrailingSlashesInURLS', () => {
        it('removes trailing slash', () => {
            const target = `<div><a href="/foo/bar/">BAZ</a></div>`
            const result = removeTrailingSlashesInURLS(target)
            expect(result).toBe(`<div><a href="/foo/bar">BAZ</a></div>`)
        })

        it('removes only trailing slashes', () => {
            const target = `<div><a href="/foo/bar/">BAZ</a><a href="https://example.org/foo/bar/">BAT</a></div>`
            const result = removeTrailingSlashesInURLS(target)
            expect(result).toBe(`<div><a href="/foo/bar">BAZ</a><a href="https://example.org/foo/bar/">BAT</a></div>`)
        })

        it('real world test case', () => {
            const target = `</p></div></div></section><section class="accordion-section faq items-1"><div class="liner"><h2>Frequently Asked Questions</h2><div class="accordion"><input type="checkbox" name="item-0" id="item-0"><label class="title" for="item-0">Do you provide curriculum for special needs children?</label><div class="content"><p>Depending on a child’s Individualized Education Program, we can tailor our curriculum to meet your needs. To discuss your child’s needs with us, please&nbsp;<a title="contact our office" href="https://dev.example.com/contact-us.html">contact our office</a>&nbsp;and we will put you in touch with our special education team.</p>
            <p>Learn about ORVA’s <a href="/academics/programs-special-education/">Special Education</a>, <a href="/academics/section-504">Section 504</a>, and <a href="https://example.com/academics/mtss/">School Interventions</a> programs.</p>`
            const result = removeTrailingSlashesInURLS(target)
            expect(result).toBe(`</p></div></div></section><section class="accordion-section faq items-1"><div class="liner"><h2>Frequently Asked Questions</h2><div class="accordion"><input type="checkbox" name="item-0" id="item-0"><label class="title" for="item-0">Do you provide curriculum for special needs children?</label><div class="content"><p>Depending on a child’s Individualized Education Program, we can tailor our curriculum to meet your needs. To discuss your child’s needs with us, please&nbsp;<a title="contact our office" href="https://dev.example.com/contact-us.html">contact our office</a>&nbsp;and we will put you in touch with our special education team.</p>
            <p>Learn about ORVA’s <a href="/academics/programs-special-education">Special Education</a>, <a href="/academics/section-504">Section 504</a>, and <a href="https://example.com/academics/mtss/">School Interventions</a> programs.</p>`)
        })

        it('image urls', () => {
            const target = `"large": "https:\/\/staging.example.com\/wp-content\/uploads\/2021\/06\/instagram.png"`
            const result = addFileProxy(target);
            expect(result).toBe( `"large": "\/assets\/images\/2021\/06\/instagram.png"`)
        })


        it('image urls REAL', () => {
            const target = `default.png","width":1114,"height":1026,"sizes":{"thumbnail":"https:\/\/staging.example.com\/wp-content\/uploads\/2021\/07\/ORVA-2imageCircles-GetStarted-homepage_@2X_01-150x150.png","thumbnail-width":150,"thumbnail-height":150,"medium":"https:\/\/staging.example.com\/wp-content\/uploads\/2021\/07\/ORVA-2imageCircles-GetStarted-homepage_@2X_01-300x276.png","medium-width":300,"medium-height":276,"medium_large":"https:\/\/staging.example.com\/wp-content\/uploads\/2021\/07\/ORVA-2imageCircles-GetStarted-homepage_@2X_01-768x707.png","medium_large-width":640,"medium_large-height":589,"large":"https:\/\/staging.example.com\/wp-content\/uploads\/2021\/07\/ORVA-2imageCircles-GetStarted-homepage_@2X_01-1024x943.png","large-width":640,"large-height":589,"1536x1536":"https:\/\/staging.example.com\/wp-content\/uploads\/2021\/07\/ORVA-2imageCircles-GetStarted-homepage_@2X_01.png","1536x1536-width":1114,"1536x1536-height":1026,"2048x2048":"https:\/\/staging.example.com\/wp-content\/uploads\/2021\/07\/ORVA-2imageCircles-GetStarted-homepage_@2X_01.png","2048x2048-width":1114,"2048x2048-height":1026,"full-width":"https:\/\/staging.example.com\/wp-content\/uploads\/2021\/07\/ORVA-2imageCircles-GetStarted-homepage_@2X_01.png","full-width-width":1114,"full-width-height":1026}}},{"acf_fc_layout":"text_title","content":{"text":"<h2>Ready to get started?<\/h2>\n<ul>\n<li>\n<h4>Enroll Online<\/h4>\n<p><a href=\"https:\/\/example.com\/portal_createaccount?SchoolID=3000&amp;adobe_mc=MCMID%3D40646602885575295472618201721382246162%7CMCORGID%3D4F4753D9552FC9B20A4C98C6%2540AdobeOrg%7CTS%3D1625088139\" target=\"_blank\" rel=\"noopener\">Create an account<\/a>`
            const result = addFileProxy(target);
            expect(result).toBe( `"large": "\/assets\/images\/2021\/06\/instagram.png"`)
        })

        // it('json url slashes', () => {
        //     const target = `{"button":{"title":"Request Info","url":"\\\/contact-us\/request-info\/","target":""}`
        //     const result =  removeTrailingSlashesInUrlsInJSON(target);
        //     expect(result).toBe(`{"button":{"title":"Request Info","url":"\/contact-us\/request-info","target":""}`)
        // })

    })
})
