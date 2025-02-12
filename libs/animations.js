export const modalBackgroundAnimation = {
	initial: {opacity: 0},
  animate: {
		opacity: .7,
		transition: {
			duration: .2,
			ease: "easeOut"
		}
  },
  exit: {
		opacity: 0,
		transition: {
			duration: .2,
			ease: "easeOut"
		}
  }
}
export const fadeInOut = {
	initial: {opacity: 0},
	animate: {
		opacity: 1,
		transition: {
			duration: .3,
			ease: "easeOut"
		}
	},
	exit: {
		opacity: 0,
		transition: {
			duration: .3,
			ease: "easeOut"
		}
	}
}
export const scaleInOut = {
    initial: {scale: .4, opacity: 0},
    animate: {
        scale: 1, 
        opacity: 1,
		transition: {
			duration: .2,
			ease: "easeOut"
		}
	},
	exit: {
		opacity: 0,
		scale: .4,
		transition: {
			duration: .2,
			ease: "easeOut"
		}
	}
}