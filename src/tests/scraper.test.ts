import { beforeAll, expect } from 'vitest';
import { findArtistNamesFromDOM } from '../content/scraper.ts';

describe('scrapes artist names from resident advisor event page', () => {
  beforeAll(() => {
    document.documentElement.innerHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Resident Advisor</title>
        </head>
        <body>
          <div id="__next">
            <li class="Column-sc-4kt5ql-0 eUGQln">
              <div data-tracking-id="event-detail-lineup">
                <div class="Box-sc-abq4qd-0 Alignment-sc-1405w7f-0 GIlZc lafiII">
                  <span color="accent" font-weight="normal" class="Text-sc-wks9sf-0 fEHoTC"≯</span>
                  <div class="Box-sc-abq4qd-0 daeYCM">
                  <h2 color="accent" font-weight="normal" class="Text-sc-wks9sf-0 SlashHeader__HeaderText-sc-103j99d-0 eJWkpu foQyWl">Lineup</h2>
                  </div>
                </div>
                <div class="Box-sc-abq4qd-0 Alignment-sc-1405w7f-0 dtgzXA lafiII">
                  <span color="secondary" font-weight="normal" class="Text-sc-wks9sf-0 CmsContent__StyledText-sc-1s0tuo4-0 guiqUO jjFEXj">MAIN ROOM - 
                    <a href="https://ra.co/dj/marron" data-tracking-id="https://ra.co/dj/marron" class="Link__AnchorWrapper-sc-1huefnz-1 kHGiqV"><span href="https://ra.co/dj/marron" data-tracking-id="https://ra.co/dj/marron" color="primary" font-weight="normal" class="Text-sc-wks9sf-0 Link__StyledLink-sc-1huefnz-0 jranq kdgimZ">MARRØN</span></a>
                    <a href="https://ra.co/dj/renewise" data-tracking-id="https://ra.co/dj/renewise" class="Link__AnchorWrapper-sc-1huefnz-1 kHGiqV"><span href="https://ra.co/dj/renewise" data-tracking-id="https://ra.co/dj/renewise" color="primary" font-weight="normal" class="Text-sc-wks9sf-0 Link__StyledLink-sc-1huefnz-0 jranq kdgimZ">Rene Wise</span></a> 
                    STEAM ROOM - 
                    <a href="https://ra.co/dj/julianahuxtable" data-tracking-id="https://ra.co/dj/julianahuxtable" class="Link__AnchorWrapper-sc-1huefnz-1 kHGiqV"><span href="https://ra.co/dj/julianahuxtable" data-tracking-id="https://ra.co/dj/julianahuxtable" color="primary" font-weight="normal" class="Text-sc-wks9sf-0 Link__StyledLink-sc-1huefnz-0 jranq kdgimZ">Juliana Huxtable</span></a>&nbsp;
                    <a href="https://ra.co/dj/rommek" data-tracking-id="https://ra.co/dj/rommek" class="Link__AnchorWrapper-sc-1huefnz-1 kHGiqV"><span href="https://ra.co/dj/rommek" data-tracking-id="https://ra.co/dj/rommek" color="primary" font-weight="normal" class="Text-sc-wks9sf-0 Link__StyledLink-sc-1huefnz-0 jranq kdgimZ">Rommek</span></a>
                  </span>
                </div>
              </div>
            </li>
          </div>
        </body>
      </html>
    `
  })

  it('should return names of artists', () => {
    const artists = findArtistNamesFromDOM();
    expect(artists).toEqual(["MARRØN", "Rene Wise", "Juliana Huxtable", "Rommek"])
  });
});