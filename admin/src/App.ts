// This file is part of HFS - Copyright 2021-2022, Massimo Melina <a@rejetto.com> - License https://www.gnu.org/licenses/gpl-3.0.txt

import { createElement as h, Fragment, useState } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import MainMenu, { getMenuLabel, mainMenu } from './MainMenu'
import { AppBar, Box, Drawer, Hidden, IconButton, ThemeProvider, Toolbar, Typography } from '@mui/material'
import { Dialogs } from './dialog'
import { useMyTheme } from './theme'
import { LoginRequired } from './LoginRequired'
import { Menu } from '@mui/icons-material'

function App() {
    return h(ThemeProvider, { theme: useMyTheme() },
        h(ApplyTheme, {},
            h(LoginRequired, {},
                h(HashRouter, {}, h(Routed)) ) ) )
}

function ApplyTheme(props:any) {
    return h(Box, {
        sx: {
            bgcolor: 'background.default', color: 'text.primary',
            display: 'flex', flexDirection: 'column',
            minHeight: '100%', flex: 1,
        },
        ...props
    })
}

function Routed() {
    const loc = useLocation().pathname.slice(1)
    const current = mainMenu.find(x => x.path === loc)
    const title = current && (current.title || getMenuLabel(current))
    const [open, setOpen] = useState(false)
    return h(Fragment, {},
        h(Hidden, { mdUp: true },
            h(StickyBar, { title, openMenu: () => setOpen(true) }),
            h(Drawer, { anchor:'left', open, onClose(){ setOpen(false) } },
                h(MainMenu, {
                    onSelect: () => setOpen(false)
                }))
        ),
        h(Box, { display: 'flex', flex: 1, }, // horizontal layout for menu-content
            h(Hidden, { mdDown: true }, h(MainMenu) ),
            h(Box, {
                component: 'main',
                sx: {
                    background: 'url(logo.svg) no-repeat right fixed',
                    backgroundSize: 'contain',
                    px: 3,
                    pb: '1em',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }
            },
                title && h(Hidden, { mdDown: true }, h(Typography, { variant:'h1', mb:2 }, title) ),
                h(Routes, {}, mainMenu.map((it,idx) =>
                    h(Route, { key: idx, path: it.path, element: h(it.comp) })) )
            ),
            h(Dialogs)
        )
    )
}

function StickyBar({ title, openMenu }: { title?: string, openMenu: ()=>void }) {
    return h(AppBar, { position: 'sticky', sx: { mb: 2 } },
        h(Toolbar, {},
            h(IconButton, {
                size: 'large',
                edge: 'start',
                color: 'inherit',
                sx: { mr: 2 },
                'aria-label': "menu",
                onClick: openMenu
            }, h(Menu)),
            title,
        )
    )
}

export default App
