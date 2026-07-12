-- Shared-Mac launcher for Precalc Tutor.
-- Compile with:  osacompile -o "Precalc Tutor.app" main.applescript
-- Opens a single shared copy of the app so several macOS accounts can use it;
-- each account keeps independent progress via its own browser localStorage.

set appFile to "/Users/Shared/Precalc Tutor.html"
try
	do shell script "open -a " & quoted form of "Google Chrome" & " " & quoted form of appFile
on error
	-- fall back to the system default browser if Chrome is unavailable
	do shell script "open " & quoted form of appFile
end try
