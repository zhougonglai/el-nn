import { desktopCapturer } from 'electron'

export default async (types = ['window', 'screen']) => await desktopCapturer.getSources({types});
