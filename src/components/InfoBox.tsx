import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { CSS } from 'styled-components/dist/types';

import { scale } from '../constants';
import { useSettings } from '../providers/SettingsProvider';
import { Link } from './Link';

const InfoBoxRoot = styled.div`
    position: fixed;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -40%);
    z-index: 100;
    background: rgba(0, 0, 0, 0.85);
    height: 90svh;
    overflow-y: scroll;

    @media (max-width: 768px) {
        height: 80svh;
    }
`;

const ShadowOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.6);
    cursor: pointer;
`;

interface BoxProps {
    $dir?: 'row' | 'column';
    $wrap?: boolean;
    $align?: CSS.Property.JustifyContent;
}

const Box = styled.div<BoxProps>`
    position: relative;
    display: flex;
    flex-direction: ${({ $dir }) => $dir || 'row'};
    flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
    gap: 1ch;
    align-items: ${({ $align }) => $align || 'center'};
    justify-content: center;
    width: 90vw;
    max-width: 90vw;
    padding: ${scale(40)}svh ${scale(190)}svh;
    white-space: pre-line;
    font-size: ${scale(75)}svh;

    & a {
        text-decoration: underline dotted;
        text-underline-offset: ${scale(10)}svh;
        text-decoration-thickness: ${scale(3)}svh;
    }

    & kbd:has(kbd) {
        margin: ${scale(20)}svh;
    }

    & kbd:not(:has(kbd)) {
        background-color: rgba(0, 0, 0, 0.5);
        border: ${scale(3)}svh solid rgba(255, 255, 255, 0.5);
        border-radius: ${scale(10)}svh;
        box-shadow: 0 ${scale(3)}svh 0 rgba(255, 255, 255, 0.5);
        padding: ${scale(2)}svh ${scale(12)}svh;
        font-size: 0.8em;
        line-height: 1;
    }
`;

const ListContainer = styled.ul`
    margin: 0;
    padding-left: 1.5em;
`;

interface InlineLinkGroupProps {
    $gap?: boolean;
}

const InlineLinkGroup = styled.span<InlineLinkGroupProps>`
    display: flex;
    gap: ${({ $gap }) => ($gap ? '0 1ch' : '0')};
    flex-wrap: wrap;
`;

type Keys = {
    keys: string[];
};

const KeyboardShortcut: React.FC<Keys> = ({ keys }) => (
    <kbd>
        {keys.map((key, idx) => (
            <React.Fragment key={key}>
                <kbd>{key}</kbd>
                {idx < keys.length - 1 && ' + '}
            </React.Fragment>
        ))}
    </kbd>
);

const SpoilerWarning = styled.div`
    text-align: center;
    color: red;
    line-height: 1;
`;

const CloseButton = styled.span`
    position: sticky;
    inset: 0;
    cursor: pointer;
    font-size: 1.5em;
    top: ${scale(100)}svh;
    right: ${scale(100)}svh;
    z-index: 101;
    float: right;
`;

export const InfoBoxContent = (
    <Box $dir='column'>
        <Box $align='flex-start'>
            <Box $wrap>
                Made with ❤️ by
                <Link href='https://github.com/zohnannor'>zohnannor</Link>
                <InlineLinkGroup>
                    (
                    <Link href='https://reddit.com/u/zohnannor'>
                        u/zohnannor
                    </Link>
                    )
                </InlineLinkGroup>
                and
                <Link href='https://github.com/swbuwk'>swbuwk</Link>
            </Box>
        </Box>
        <SpoilerWarning>
            <h1>SPOILER WARNING</h1>
            This site contains spoilers for the Berserk manga. I would suggest
            leaving the page if you are interested in the story.
        </SpoilerWarning>

        <SpoilerWarning>
            <h1>It's also WIP and is missing a few things</h1>
        </SpoilerWarning>

        <Box $dir='column'>
            <h2>Site info and features:</h2>
            <ListContainer>
                <li>
                    <InlineLinkGroup $gap>
                        Click any image (arc, chapter, volume) to go to the
                        corresponding
                        <Link href='https://berserk.fandom.com/wiki/'>
                            wiki
                        </Link>
                        page
                    </InlineLinkGroup>
                </li>
                <li>Show/hide arc/volume titles</li>
                <li>Hover over chapter images for previews (desktop only)</li>
                <li>
                    Use the scrollbar at the bottom of the page for faster
                    navigation (desktop only)
                </li>
                <li>
                    Volumes without images are not officially confirmed and may
                    be incorrect.
                </li>
                <li>
                    Chapter release dates in the timeline are displayed in your
                    local timezone
                </li>
                <li>
                    Press
                    <KeyboardShortcut keys={['Ctrl', 'C']} />
                    to toggle cross-lines (desktop only)
                </li>
                <li>
                    The button below the info button toggles unbounded chapter
                    width (volume width would not be constant but instead depend
                    on the number of pages in the chapters)
                </li>
                <li>
                    Use chapter calendar to quickly navigate to a chapter if you
                    know the date of its release, by clicking on a day. Or,
                    click on a day in the timeline to open a calendar and
                    navigate to the chapter date
                </li>
                <li>
                    I will personally update this site whenever new chapter
                    releases. There can be a slight delay if i'm busy, but also
                    your browser might use cached version of the page. On
                    desktop browsers, you can press
                    <KeyboardShortcut keys={['Ctrl', 'R']} />
                    to refresh
                </li>
            </ListContainer>
        </Box>

        <Box>
            This is a non-profit, unofficial fan site. We are not affiliated
            with Dark Horse or the authors of Berserk. All images are
            copyrighted by their respective owners and are used for illustration
            purposes only. We do not own any artwork, characters, or
            intellectual property on this site.
        </Box>

        <Box $dir='column'>
            <h3>Official Links:</h3>
            <Link href='https://younganimal.com/series/f68f676b354d4/'>
                Official Berserk Website
            </Link>
            <Link href='https://www.darkhorse.com/'>Dark Horse</Link>
        </Box>
    </Box>
);

export const InfoBox: React.FC = () => {
    const { infoBoxOpen, setInfoBoxOpen } = useSettings();

    if (!infoBoxOpen) return null;

    return ReactDOM.createPortal(
        <>
            <ShadowOverlay
                className='shadowOverlay'
                onClick={() => setInfoBoxOpen(false)}
            />
            <InfoBoxRoot className='infoBoxRoot'>
                <CloseButton onClick={() => setInfoBoxOpen(false)}>
                    &times;
                </CloseButton>
                {InfoBoxContent}
            </InfoBoxRoot>
        </>,
        document.querySelector('#infoBox')!
    );
};
