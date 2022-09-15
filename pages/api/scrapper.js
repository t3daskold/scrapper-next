const cheerio = require('cheerio');
const axios = require('axios')
/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

import Cors from 'cors'
const cors = Cors({
    methods: ['POST', 'GET', 'HEAD'],
})
function runMiddleware(
    req,
    res,
    fn,
) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}
export default async function handler(req,res) {
    await runMiddleware(req, res, cors)

    const result = await axios({
            method:"get",
            url:req.body.url,

        })
            .then(res => {
                const about = []
                const obj = {}
                const list = [obj]
                obj['description'] = about
                const $ = cheerio.load(res.data);
                $('.title-info-title-text').each((i, e) => {
                    const title = $(e).text();
                    obj['title'] = title
                })
                $('body > script:nth-child(5)').each((i,e) => {
                    const initialData = $(e).text()
                    console.log(initialData)
                    obj['initialData'] = initialData
                })
                $('li[class=params-paramsList__item-appQw]').each((i, e) => {
                    const style = $(e).find('style').remove()
                    const text = $(e).text()
                    about.push(text)
                })
                $('.style-price-value-main-TIg6u').each((i, e) => {
                    const price = $(e).text()
                  obj['price'] = price
                })
                $('.style-item-address__string-wt61A').each((i, e) => {
                    const location = $(e).text()
                   obj['location'] = location
                })
                console.log(list)
                return list
            }).catch(err => res.status(500).end(err.message));
        res.status(200).json(result)
}

