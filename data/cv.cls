\LoadClass{scrartcl}
\RequirePackage[nochapters]{classicthesis} 
\RequirePackage[LabelsAligned]{currvita}
\RequirePackage{hyperref}
\RequirePackage[letterpaper]{geometry}
\RequirePackage{marvosym}

\date{}
\renewcommand{\cfoot}{\thepage}  % Disable the header ruler


\areaset[5mm]{400pt}{700pt}
\hypersetup{colorlinks, breaklinks, urlcolor=Maroon, linkcolor=Maroon}
\definecolor{auburn}{rgb}{0.43, 0.21, 0.1}
\definecolor{burgundy}{rgb}{0.5, 0.0, 0.13}
\definecolor{maroon(html/css)}{rgb}{0.5, 0.0, 0.0}

\reversemarginpar  
\renewcommand{\familydefault}{\sfdefault}
\renewcommand{\cvheadingfont}{\LARGE\color{Maroon}}


\newcommand{\info}[6]{
	\begin{center} 
			 \begin{large}
			 {\Large\Mundus} #1 {\large\textperiodcentered} 
			 {\Large\Telefon} #2 {\large\textperiodcentered}  
			 {\Large\Letter} #3\\
			 \vspace{.2em}
	 		 #4 {\large\textperiodcentered}
	 		 #5 {\large\textperiodcentered} 
	 		 #6\\
	 		 \vspace{.2em}
	 		 \end{large}
	\end{center}
}

\newcommand{\HeaderName}[1]{\spacedallcaps{#1}  \hfill \scriptsize Updated: \today}

\newcommand{\NewHeader}[1]{\vspace{1.em}\noindent\spacedlowsmallcaps{\Large\color{maroon(html/css)}#1}\vspace{1.5em}}


\newcommand{\desc}[3]{\hangafter=0\noindent\raggedright{\MarginTextYear{#1}{#2}#3}\par\vspace{.5em} }

\newcommand{\MarginTextYear}[2]{\marginpar{\small#2 \\\vspace{0.2em} #1  }} 
\newcommand{\Description}[1]{\hangafter=0\noindent\raggedright{#1}\par\vspace{1em}}

\newlength{\langbox} 
\settowidth{\langbox}{Language}

\newcommand{\lang}[1]{\parbox{\langbox}{\color{maroon(html/css)}\textsc{#1}}}