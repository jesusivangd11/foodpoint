; FoodPoint (antes "Mesana 3.0").
; Al cambiar el nombre del producto, el actualizador de electron-builder RENOMBRA
; los accesos directos "Mesana 3.0" a "FoodPoint", pero conservan el destino viejo
; (Mesana 3.0.exe), que ya no existe. Aqui se vuelven a crear apuntando al
; ejecutable nuevo y se relanza ese, para que la app se reabra sola tras actualizar.
!macro customInstall
  ${if} ${FileExists} "$newDesktopLink"
    Delete "$newDesktopLink"
    CreateShortCut "$newDesktopLink" "$appExe" "" "$appExe" 0 "" "" "${APP_DESCRIPTION}"
    WinShell::SetLnkAUMI "$newDesktopLink" "${APP_ID}"
  ${endIf}
  ${if} ${FileExists} "$newStartMenuLink"
    Delete "$newStartMenuLink"
    CreateShortCut "$newStartMenuLink" "$appExe" "" "$appExe" 0 "" "" "${APP_DESCRIPTION}"
    WinShell::SetLnkAUMI "$newStartMenuLink" "${APP_ID}"
  ${endIf}
  ; Restos del nombre anterior, por si quedaron
  Delete "$DESKTOP\Mesana 3.0.lnk"
  Delete "$SMPROGRAMS\Mesana 3.0.lnk"
  Delete "$INSTDIR\Mesana 3.0.exe"
  StrCpy $launchLink "$appExe"
!macroend
