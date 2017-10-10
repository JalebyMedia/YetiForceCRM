<?php

/**
 * Base test class
 * @package YetiForce.Test
 * @copyright YetiForce Sp. z o.o.
 * @license YetiForce Public License 2.0 (licenses/License.html or yetiforce.com)
 * @author Mariusz Krzaczkowski <m.krzaczkowski@yetiforce.com>
 */
class Gui_Base extends PHPUnit_Extensions_Selenium2TestCase
{

	public static $browsers = [
		[
			'driver' => 'chrome',
			'host' => 'localhost',
			'port' => 4444,
			'browserName' => 'chrome',
			'sessionStrategy' => 'shared',
		],
	];
	protected $captureScreenshotOnFailure = TRUE;

	protected function setUp()
	{
		parent::setUp();

		$this->setBrowserUrl(AppConfig::main('site_URL'));
		$this->setBrowser('chrome');

		$screenshotsDir = __DIR__ . '/../screenshots';
		if (!file_exists($screenshotsDir)) {
			mkdir($screenshotsDir, 0777, true);
		}
		$this->listener = new PHPUnit_Extensions_Selenium2TestCase_ScreenshotListener($screenshotsDir);
		$this->prepareSession();
	}

	/**
	 * @codeCoverageIgnore
	 */
	public function onNotSuccessfulTest(Throwable $e)
	{
		$this->listener->addError($this, $e, null);
		parent::onNotSuccessfulTest($e);
	}
}
