import unittest
from unittest.mock import patch
from flask import Flask, request
from webapp.api.posts.addComment import postComment

class TestPostComment(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True

    @patch('webapp.api.posts.addComment.table')
    @patch('webapp.api.posts.addComment.jwt')
    def test_post_comment_success(self, mock_jwt, mock_table):
        mock_jwt.decode.return_value = {'username': 'ttest_user13414141432524645234dsasdf'}
        mock_table.get_item.return_value = {'Item': {'videoID': '123'}}

        with self.app.test_request_context('/api/comment/', method='POST', json={'videoID': '123', 'comment': 'Test comment'}):
            request.headers = {'Authorization': 'Bearer my_token', 'Content-Type': 'application/json'}
            response = postComment()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'status': 'success', 'message': 'Comment posted'})

    @patch('webapp.api.posts.addComment.table')
    @patch('webapp.api.posts.addComment.jwt')
    def test_post_comment_video_not_found(self, mock_jwt, mock_table):
        mock_jwt.decode.return_value = {'username': 'test_user13414141432524645234dsasdf'}
        mock_table.get_item.return_value = {}

        with self.app.test_request_context('/api/comment/', method='POST', json={'videoID': '123', 'comment': 'Test comment'}):
            request.headers = {'Authorization': 'Bearer my_token', 'Content-Type': 'application/json'}
            response = postComment()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'status': 'error', 'message': 'Video not found'})
