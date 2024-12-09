document.addEventListener('DOMContentLoaded', () => {
	const blogCards = document.querySelectorAll('.blog-card');

	blogCards.forEach((card) => {
		const blogId = card.getAttribute('data-blog-id');
		const viewCountElement = document.getElementById(`viewCount-${blogId}`);
		const likeBtn = document.getElementById(`likeBtn-${blogId}`);
		const likeCountElement = document.getElementById(`likeCount-${blogId}`);
		const heartIcon = document.getElementById(`heartIcon-${blogId}`).querySelector('path');
		const shareCountElement = document.getElementById(`shareCount-${blogId}`);
		const shareBtn = document.getElementById(`shareBtn-${blogId}`);
		const shareModal = document.getElementById(`shareModal-${blogId}`);
		
		// Helper function to format large numbers
		function formatNumber(number) {
			if (number >= 1e12) {
				return (number / 1e12).toFixed(1) + 'T'; // Trillions
			} else if (number >= 1e9) {
				return (number / 1e9).toFixed(1) + 'B'; // Billions
			} else if (number >= 1e6) {
				return (number / 1e6).toFixed(1) + 'M'; // Millions
			} else if (number >= 1e3) {
				return (number / 1e3).toFixed(1) + 'K'; // Thousands
			}
			return number; // No formatting for smaller numbers
		}

		// Fetch view count and format it
		fetch(`/api/views/${blogId}`)
		.then((response) => response.json())
		.then((data) => {
			const formattedViews = formatNumber(data.views);
			viewCountElement.textContent = formattedViews;
		});

		// REMOVE THIS PART: Increment view count when "Read More" is clicked
		// This ensures view count is only updated on the blog page.

		// Fetch and update like count
		fetch(`/api/likes/${blogId}`)
		.then((response) => response.json())
		.then((data) => {
			const formattedLikes = formatNumber(data.likes);
			likeCountElement.textContent = formattedLikes;
			if (localStorage.getItem(`hasLiked-${blogId}`) === 'true') {
				heartIcon.setAttribute('fill', '#ea3509');
			}
		});

		// Handle like button click
		likeBtn.addEventListener('click', () => {
			const currentlyLiked = localStorage.getItem(`hasLiked-${blogId}`) === 'true';

			if (currentlyLiked) {
				fetch(`/api/unlike/${blogId}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
				})
				.then((response) => response.json())
				.then((data) => {
					const formattedLikes = formatNumber(data.likes);
					likeCountElement.textContent = formattedLikes;
					heartIcon.setAttribute('fill', 'none');
					localStorage.setItem(`hasLiked-${blogId}`, 'false');
				});
			} else {
				fetch(`/api/likes/${blogId}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
				})
				.then((response) => response.json())
				.then((data) => {
					const formattedLikes = formatNumber(data.likes);
					likeCountElement.textContent = formattedLikes;
					heartIcon.setAttribute('fill', '#ea3509');
					localStorage.setItem(`hasLiked-${blogId}`, 'true');
				});
			}
		});

		// Fetch and display initial share count
		fetch(`/api/shares/${blogId}`)
		.then((response) => response.json())
		.then((data) => {
			const formattedShares = formatNumber(data.shares);
			shareCountElement.textContent = formattedShares;
		});

		// Open the share modal when the share button is clicked
		shareBtn.addEventListener('click', () => {
			shareModal.classList.toggle('hidden');
		});

		// Social media sharing logic (unchanged)
		const socialMediaButtons = shareModal.querySelectorAll('a');
		socialMediaButtons.forEach(button => {
			button.addEventListener('click', (event) => {
				const platform = event.target.closest('a').id.split('Share')[0].toLowerCase();
				const blogCard = shareModal.closest('.blog-card');
				const blogTitle = blogCard.querySelector('.title h3').innerText;
				const blogDescription = blogCard.querySelector('.def p').innerText;
				const blogUrl = blogCard.querySelector('.read-more-btn').href;

				let shareUrl = '';
				if (platform === 'whatsapp') {
					const message = `Check out this amazing blog: "${blogTitle}" I found on Dev. Elijah's portfolio! ${blogDescription} ${blogUrl}`;
					shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
				} else if (platform === 'facebook') {
					shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}&quote=${encodeURIComponent(blogTitle + " - " + blogDescription)}`;
				} else if (platform === 'twitter') {
					shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(blogTitle + " - " + blogDescription)}&url=${encodeURIComponent(blogUrl)}`;
				} else if (platform === 'linkedin') {
					shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`;
				}

				window.open(shareUrl, '_blank');

				// Update share count on the backend and frontend
				fetch(`/api/shares/${blogId}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
				})
				.then((response) => response.json())
				.then((data) => {
					const formattedShares = formatNumber(data.shares);
					shareCountElement.textContent = formattedShares;
				});

				shareModal.classList.add('hidden');
			});
		});

		if (navigator.share) {
			shareBtn.addEventListener('click', (event) => {
				const blogCard = event.target.closest('.blog-card');
				const blogTitle = blogCard.querySelector('.title h3').innerText;
				const blogDescription = blogCard.querySelector('.def p').innerText;
				const blogUrl = blogCard.querySelector('.read-more-btn').href;

				navigator.share({
					title: blogTitle,
					text: blogDescription,
					url: blogUrl,
				}).then(() => {
					console.log('Successfully shared');
				}).catch((error) => {
					console.log('Error sharing:', error);
				});
			});
		}
	});
});